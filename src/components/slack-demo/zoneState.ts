import { GOVERNANCE_EVENT_ACTIVE_FROM, SCENE_SEQUENCE } from './constants'
import type { ComponentVisualState, SlackRevenueDemoState } from './types'

export type DemoZone = 'slack' | 'orchestration' | 'risk' | 'timeline'

const STATE_RANK: Record<SlackRevenueDemoState, number> = {
  idle: -1,
  slack_thread_active: 0,
  mention_detected: 1,
  route_verified: 2,
  agent_context_loaded: 3,
  sources_querying: 4,
  evidence_synthesizing: 5,
  risk_detected: 6,
  approval_or_action_selected: 7,
  slack_reply_sent: 8,
  governance_logged: 9,
  complete: 10
}

const SLACK_ACTIVE: SlackRevenueDemoState[] = [
  'slack_thread_active',
  'mention_detected',
  'slack_reply_sent',
  'governance_logged',
  'complete'
]

const ORCHESTRATION_ACTIVE: SlackRevenueDemoState[] = [
  'route_verified',
  'agent_context_loaded',
  'sources_querying',
  'evidence_synthesizing'
]

const RISK_ACTIVE: SlackRevenueDemoState[] = [
  'risk_detected',
  'approval_or_action_selected'
]

export const ZONE_PANEL_CLASS: Record<ComponentVisualState, string> = {
  idle: 'border-border bg-muted/30 opacity-70',
  active: 'border-primary/50 bg-card ring-1 ring-primary/25',
  complete: 'border-border bg-muted/50',
  error: 'border-destructive/50 bg-destructive/5'
}

export function stateRank(state: SlackRevenueDemoState): number {
  return STATE_RANK[state] ?? -1
}

function rank(state: SlackRevenueDemoState): number {
  return stateRank(state)
}

function isAtOrAfter(
  current: SlackRevenueDemoState,
  threshold: SlackRevenueDemoState
): boolean {
  return rank(current) >= rank(threshold)
}

export function getZoneVisualState(
  zone: DemoZone,
  currentState: SlackRevenueDemoState
): ComponentVisualState {
  if (currentState === 'idle') return 'idle'

  if (zone === 'slack') {
    if (SLACK_ACTIVE.includes(currentState)) return 'active'
    if (isAtOrAfter(currentState, 'route_verified')) {
      return 'complete'
    }
    return 'idle'
  }

  if (zone === 'orchestration') {
    if (ORCHESTRATION_ACTIVE.includes(currentState)) return 'active'
    if (isAtOrAfter(currentState, 'risk_detected')) return 'complete'
    return 'idle'
  }

  if (zone === 'risk') {
    if (RISK_ACTIVE.includes(currentState)) return 'active'
    if (isAtOrAfter(currentState, 'slack_reply_sent')) {
      return 'complete'
    }
    return 'idle'
  }

  return 'idle'
}

export function panelClassForVisualState(
  visualState: ComponentVisualState,
  className?: string
): string {
  return [ZONE_PANEL_CLASS[visualState], className].filter(Boolean).join(' ')
}

export function getGovernanceEventVisualState(
  event: string,
  currentState: SlackRevenueDemoState
): ComponentVisualState {
  const threshold = GOVERNANCE_EVENT_ACTIVE_FROM[event]
  if (!threshold) return 'idle'

  const eventRank = rank(threshold)
  const currentRank = rank(currentState)

  if (currentRank > eventRank) return 'complete'
  if (currentRank === eventRank) return 'active'
  return 'idle'
}

export function getActiveGovernanceEvent(
  currentState: SlackRevenueDemoState
): string | null {
  if (currentState === 'complete') {
    return 'agent.reply.sent'
  }

  for (const step of SCENE_SEQUENCE) {
    const events = Object.entries(GOVERNANCE_EVENT_ACTIVE_FROM).filter(
      ([, state]) => state === step.state
    )
    if (events.length > 0 && currentState === step.state) {
      return events[events.length - 1][0]
    }
  }
  return null
}
