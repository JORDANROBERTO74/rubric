/** Shared governance timeline events (same product flow for churn and migration demos). */
export const DEMO_GOVERNANCE_EVENTS = [
  'thread.message.received',
  'thread.user.linked',
  'agent.resolved',
  'thread.channel_instructions.loaded',
  'agent.execution.started',
  'sources.queried',
  'agent.decision.recorded',
  'agent.reply.sent'
] as const

export const SLACK_LINK_LABELS = {
  linkLabel: 'View thread',
  backToSummaryLabel: 'Back to summary'
} as const
