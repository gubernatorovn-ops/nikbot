'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { automationsApi } from '@/lib/api';
import { TriggerNode } from '@/components/flow/nodes/trigger-node';
import { MessageNode } from '@/components/flow/nodes/message-node';
import { ConditionNode } from '@/components/flow/nodes/condition-node';
import { ActionNode } from '@/components/flow/nodes/action-node';
import { AiNode } from '@/components/flow/nodes/ai-node';
import { NodePanel } from '@/components/flow/node-panel';
import { NodeEditor } from '@/components/flow/node-editor';

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  ai: AiNode,
};

export default function FlowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [automation, setAutomation] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    automationsApi
      .getById(params.id as string)
      .then(({ data }) => {
        setAutomation(data);
        const flowNodes = (data.nodes || []).map((n: any) => ({
          id: n.id,
          type: getNodeType(n.type),
          position: n.position,
          data: { label: n.name, config: n.config, nodeType: n.type },
        }));
        setNodes(flowNodes);
        setEdges(data.edges || []);
      })
      .catch(console.error);
  }, [params.id]);

  const getNodeType = (type: string) => {
    if (type.includes('TRIGGER')) return 'trigger';
    if (type.includes('MESSAGE') || type.includes('BUTTON')) return 'message';
    if (type.includes('CONDITION')) return 'condition';
    if (type.includes('AI')) return 'ai';
    return 'action';
  };

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleAddNode = (type: string, nodeType: string, label: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: (nodes.length + 1) * 100 },
      data: { label, config: {}, nodeType },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleUpdateNode = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n))
    );
    setSelectedNode(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const flowNodes = nodes.map((n) => ({
        id: n.id,
        type: n.data.nodeType,
        name: n.data.label,
        config: n.data.config || {},
        position: n.position,
      }));
      await automationsApi.saveFlow(params.id as string, flowNodes, edges);
      alert('Сохранено!');
    } catch (error) {
      console.error(error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (!automation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/automations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-xl font-bold">{automation.name}</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <div className="flex-1 flex gap-4">
        <NodePanel onAddNode={handleAddNode} />

        <div className="flex-1 border rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            onUpdate={handleUpdateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}
