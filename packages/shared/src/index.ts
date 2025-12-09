import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationName: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export enum Platform {
  TELEGRAM = 'TELEGRAM',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
}

export enum NodeType {
  TRIGGER_START = 'TRIGGER_START',
  SEND_MESSAGE = 'SEND_MESSAGE',
  SEND_BUTTONS = 'SEND_BUTTONS',
  CONDITION = 'CONDITION',
  AI_RESPONSE = 'AI_RESPONSE',
  DELAY = 'DELAY',
  SET_VARIABLE = 'SET_VARIABLE',
  ADD_TAG = 'ADD_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
  ADD_POINTS = 'ADD_POINTS',
  END = 'END',
}

export enum TriggerType {
  MESSAGE = 'MESSAGE',
  KEYWORD = 'KEYWORD',
  COMMAND = 'COMMAND',
  BUTTON_CLICK = 'BUTTON_CLICK',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export interface FlowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
