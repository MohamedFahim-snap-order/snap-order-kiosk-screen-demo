export type AgentEvent = {
  id: number;
  type: "agent.state" | "agent.transcript";
  state?: string;
  text?: string;
  final?: boolean;
};

export interface AgentTransport {
  poll(conversationId: string, after: number): Promise<{ events: AgentEvent[]; cursor: number }>;
}
