import type { SceneStep, SlackRevenueDemoState } from './types'
import { getSourcesQueryingSceneMs } from './fixtures/executionUiFixtures'
import { getScenarioBundle } from './scenarios'

export { getScenarioBundle, getScenarioData } from './scenarios'

const churn = getScenarioBundle('churn')
const churnStepLogCount = churn.executionUi.stepLogs.length

/** "Route verified — preparing live source queries…" (before step logs). */
export const ORCHESTRATION_PREPARING_ROUTE_MS = 900
export const ORCHESTRATION_PREPARING_CONTEXT_MS = 400

export const APPROVAL_CARDS_START_MS = 200
/** Decision card settles before the first workflow step animates in. */
export const APPROVAL_DECISION_SETTLE_MS = 520
export const APPROVAL_CARD_STAGGER_MS = 920
/** Hold last workflow step in "In progress" before marking sequence complete. */
export const APPROVAL_LAST_STEP_HOLD_MS = 880
/** Extra hold after the last step before the scene advances (keeps risk focus). */
export const APPROVAL_SCENE_BUFFER_MS = 600
export const APPROVAL_CARD_COUNT = churn.approvalUi.workflowSteps.length

/** Total in-scene time for escalation + workflow trace. */
export function getApprovalSequenceTotalMs(stepCount: number): number {
  const firstStepAt = APPROVAL_CARDS_START_MS + APPROVAL_DECISION_SETTLE_MS
  const lastStepAt =
    firstStepAt + APPROVAL_CARD_STAGGER_MS * Math.max(0, stepCount - 1)
  return lastStepAt + APPROVAL_LAST_STEP_HOLD_MS + APPROVAL_SCENE_BUFFER_MS
}

/** Scene 0 — human thread messages reveal evenly across this window. */
export const SLACK_THREAD_ACTIVE_MS = 1200
/** First bubble appears after a short beat (not at t=0). */
export const SLACK_THREAD_FIRST_MESSAGE_MS = 100

/** Even spacing from first message through end of `SLACK_THREAD_ACTIVE_MS`. */
export function getSlackMessageStaggerMs(messageCount: number): number {
  if (messageCount <= 1) return 0
  const span = SLACK_THREAD_ACTIVE_MS - SLACK_THREAD_FIRST_MESSAGE_MS
  return Math.round(span / (messageCount - 1))
}

/** 1-based message index → delay from scene start. */
export function getSlackMessageDelayMs(
  messageIndex: number,
  messageCount: number
): number {
  if (messageCount <= 0 || messageIndex < 1) return 0
  if (messageCount === 1) return SLACK_THREAD_FIRST_MESSAGE_MS
  if (messageIndex === 1) return SLACK_THREAD_FIRST_MESSAGE_MS
  const span = SLACK_THREAD_ACTIVE_MS - SLACK_THREAD_FIRST_MESSAGE_MS
  return (
    SLACK_THREAD_FIRST_MESSAGE_MS +
    Math.round((span * (messageIndex - 1)) / (messageCount - 1))
  )
}

export const RISK_MAX_BUILD_STEP = 2
/** Pause after the risk panel activates before the first section appears. */
export const RISK_BUILD_INITIAL_MS = 450
/** Delay between grounding → details grid → signals summary. */
export const RISK_BUILD_STAGGER_MS = 1400
/** Hold after signals summary before the approval / escalation scene. */
export const RISK_POST_SUMMARY_HOLD_MS = 800

export function getRiskDetectedSceneMs(): number {
  return (
    RISK_BUILD_INITIAL_MS +
    RISK_BUILD_STAGGER_MS * RISK_MAX_BUILD_STEP +
    RISK_POST_SUMMARY_HOLD_MS
  )
}

export const SCENE_SEQUENCE: SceneStep[] = [
  { state: 'slack_thread_active', durationMs: SLACK_THREAD_ACTIVE_MS },
  { state: 'mention_detected', durationMs: 1200 },
  { state: 'route_verified', durationMs: ORCHESTRATION_PREPARING_ROUTE_MS },
  {
    state: 'agent_context_loaded',
    durationMs: ORCHESTRATION_PREPARING_CONTEXT_MS
  },
  {
    state: 'sources_querying',
    durationMs: getSourcesQueryingSceneMs(churnStepLogCount)
  },
  { state: 'evidence_synthesizing', durationMs: 1800 },
  { state: 'risk_detected', durationMs: getRiskDetectedSceneMs() },
  {
    state: 'approval_or_action_selected',
    durationMs: getApprovalSequenceTotalMs(APPROVAL_CARD_COUNT)
  },
  { state: 'slack_reply_sent', durationMs: 2400 },
  { state: 'governance_logged', durationMs: 1400 },
  { state: 'complete', durationMs: 4000 }
]

export const TOTAL_ACTIVE_MS = SCENE_SEQUENCE.reduce(
  (sum, step) => sum + step.durationMs,
  0
)

/** Index of the `complete` hold scene (progress reaches 100% at its start). */
export const LAST_SCENE_INDEX = SCENE_SEQUENCE.length - 1

/** Timeline for the progress bar — excludes the final hold on `complete`. */
export const TOTAL_PROGRESS_MS = SCENE_SEQUENCE.slice(
  0,
  LAST_SCENE_INDEX
).reduce((sum, step) => sum + step.durationMs, 0)

export function progressFromPlayheadMs(playheadMs: number): number {
  if (TOTAL_PROGRESS_MS <= 0) return 100
  const cappedMs = Math.min(playheadMs, TOTAL_PROGRESS_MS)
  return Math.min(100, (cappedMs / TOTAL_PROGRESS_MS) * 100)
}

export const MENTION_TOKEN = '@rubric'
export const SLACK_AGENT_AUTHOR = 'Rubric'
/** @deprecated Use getSlackMessageStaggerMs(messageCount) */
export const SLACK_MESSAGE_STAGGER_MS = getSlackMessageStaggerMs(
  churn.data.slackMessages.length
)

export const SCENE_LABELS: Record<SlackRevenueDemoState, string> = {
  idle: 'Idle',
  slack_thread_active: 'Thread active',
  mention_detected: 'Mention detected',
  route_verified: 'Route verified',
  agent_context_loaded: 'Agent context loaded',
  sources_querying: 'Sources querying',
  evidence_synthesizing: 'Evidence synthesizing',
  risk_detected: 'Risk detected',
  approval_or_action_selected: 'Approval or action selected',
  slack_reply_sent: 'Reply sent',
  governance_logged: 'Governance logged',
  complete: 'Complete'
}

/** @deprecated Use getScenarioData('churn') or getScenarioBundle('churn').data */
export const CHURN_SCENARIO = churn.data

export const RISK_SUMMARY = churn.riskSummary

export const RISK_UI = churn.riskUi

/** @deprecated Use RISK_SUMMARY */
export const RISK_PLACEHOLDER = {
  account: churn.riskSummary.account,
  risk: churn.riskSummary.riskFinal,
  confidence: churn.riskSummary.confidence,
  signals: churn.riskSummary.signalsSummary
} as const

export const APPROVAL_UI = churn.approvalUi

export const APPROVAL_ACTIONS = churn.approvalActions

export const APPROVAL_TIMELINE_HINT = 'Escalation checkpoint recorded'

/** @deprecated Use APPROVAL_ACTIONS */
export const APPROVAL_PLACEHOLDER = APPROVAL_ACTIONS.map(a => a.label)

export const AGENT_REPLY_STUB = 'Working on it...'
export const AGENT_REPLY_FINAL = churn.data.agentResult
export const REPLY_CROSSFADE_DELAY_MS = 400
export const REPLY_CROSSFADE_DURATION_MS = 500
export const GOVERNANCE_LOGGED_LABEL = 'logged'

export const SLACK_SOURCE_PREVIEW_COPY = churn.slackSourcePreview

export const SLACK_COMPOSER_COPY = {
  placeholder: churn.slackComposerPlaceholder,
  ariaLabel: 'Message input (demo preview, read-only)'
} as const

/** Fixed height for Slack / orchestration / risk zone panels (scroll when content overflows). */
export const DEMO_ZONE_PANEL_HEIGHT_CLASS =
  'h-[396px] sm:h-[449px] lg:h-[475px]'

/** Distance from scroll bottom to treat user as "following" new content. */
export const FOLLOW_SCROLL_THRESHOLD_PX = 48

export const GRID_LAYOUT_TRANSITION_MS = 750

/** @deprecated Use GRID_LAYOUT_TRANSITION_MS */
export const COMPLETE_LAYOUT_TRANSITION_MS = GRID_LAYOUT_TRANSITION_MS

/** Operational ease — matches demo data-travel curve (guide motion language). */
export const GRID_LAYOUT_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1
]

export const GOVERNANCE_EVENT_ACTIVE_FROM: Record<
  string,
  SlackRevenueDemoState
> = {
  'thread.message.received': 'slack_thread_active',
  'thread.user.linked': 'mention_detected',
  'agent.resolved': 'route_verified',
  'thread.channel_instructions.loaded': 'agent_context_loaded',
  'agent.execution.started': 'sources_querying',
  'sources.queried': 'evidence_synthesizing',
  'agent.decision.recorded': 'risk_detected',
  'agent.reply.sent': 'governance_logged'
}

export function getSceneState(sceneIndex: number): SlackRevenueDemoState {
  if (sceneIndex < 0 || sceneIndex >= SCENE_SEQUENCE.length) {
    return 'idle'
  }
  return SCENE_SEQUENCE[sceneIndex].state
}

export function getElapsedMsUpTo(sceneIndex: number): number {
  return SCENE_SEQUENCE.slice(0, sceneIndex).reduce(
    (sum, step) => sum + step.durationMs,
    0
  )
}
