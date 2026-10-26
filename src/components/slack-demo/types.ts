import type { ScenarioApprovalUi } from './components/approval-ui/types'
import type { ScenarioExecutionUi } from './components/execution-ui/types'
import type { ScenarioRiskUi } from './components/risk-ui/types'

export type { ScenarioApprovalUi, ScenarioExecutionUi, ScenarioRiskUi }

export type SlackRevenueDemoState =
  | 'idle'
  | 'slack_thread_active'
  | 'mention_detected'
  | 'route_verified'
  | 'agent_context_loaded'
  | 'sources_querying'
  | 'evidence_synthesizing'
  | 'risk_detected'
  | 'approval_or_action_selected'
  | 'slack_reply_sent'
  | 'governance_logged'
  | 'complete'

export type SceneStep = {
  state: SlackRevenueDemoState
  durationMs: number
}

export type ScenarioId = 'churn' | 'migration'

export type ComponentVisualState = 'idle' | 'active' | 'complete' | 'error'

export type AgentReplyPhase = 'hidden' | 'stub' | 'crossfading' | 'final'

export type SourceSignalIconId =
  | 'ticket'
  | 'trendingDown'
  | 'creditCard'
  | 'calendar'
  | 'history'
  | 'infrastructure'

export type SourceSignal = {
  id: string
  label: string
  evidenceLine: string
  detail?: string
  icon: SourceSignalIconId
}

export type RiskBuildSection = 'grounding' | 'details' | 'summary'

export type ApprovalAction = {
  id: string
  label: string
}

export type ApprovalPhase = 'hidden' | 'cards' | 'complete'

export type SlackThreadMessage = {
  id: string
  author: string
  content: string
  timestamp?: string
}

export type ScenarioData = {
  channel: string
  background: string
  slackMessages: SlackThreadMessage[]
  sourceEvidence: { label: string; value: string }[]
  agentResult: string
  governanceEvents: string[]
}

/** @deprecated Use ScenarioData */
export type ChurnScenarioData = ScenarioData

export type RiskSummaryCopy = {
  account: string
  riskFinal: string
  riskReviewing: string
  confidence: string
  signalsSummary: string
}

export type SlackSourcePreviewCopy = {
  channel: string
  summary: string
  linkLabel: string
  backToSummaryLabel: string
}

export type ChannelInstructionsCopy = {
  channel: string
  summary: string
}

/**
 * Full per-scenario copy and derived demo data.
 * Consumed via getScenarioBundle().
 */
export type ScenarioBundle = {
  id: ScenarioId
  data: ScenarioData
  channelInstructions: ChannelInstructionsCopy
  sourceSignals: SourceSignal[]
  riskSummary: RiskSummaryCopy
  riskUi: ScenarioRiskUi
  approvalActions: ApprovalAction[]
  approvalUi: ScenarioApprovalUi
  slackSourcePreview: SlackSourcePreviewCopy
  slackComposerPlaceholder: string
  /**
   * Human messages before the @mention line (scenario metadata).
   * Thread reveal uses the same stagger for all `slackMessages`.
   */
  preMentionMessageCount: number
  executionUi: ScenarioExecutionUi
}
