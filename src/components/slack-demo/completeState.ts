import type { SlackRevenueDemoState } from './types'
import type { DemoZone } from './zoneState'
import { getZoneVisualState } from './zoneState'

export type DemoGridLayoutMode =
  | 'complete'
  | 'slack-focus'
  | 'orchestration-focus'
  | 'risk-focus'
  | 'default'

export function isCompleteState(state: SlackRevenueDemoState): boolean {
  return state === 'complete'
}

export function shouldUseSlackSourcePreview(_state: SlackRevenueDemoState): boolean {
  return false
}

export function shouldUseCompleteLayout(state: SlackRevenueDemoState): boolean {
  return isCompleteState(state)
}

/** Screenshot frame: risk column ~50%. */
export function getCompleteGridClass(): string {
  return 'lg:grid-cols-[minmax(160px,22%)_minmax(180px,28%)_minmax(260px,50%)]'
}

/** Balanced columns when no zone is active. */
export function getDefaultGridClass(): string {
  return 'lg:grid-cols-[minmax(220px,28%)_minmax(200px,34%)_minmax(220px,38%)]'
}

/** Soft focus: active slack column ~40%. */
export function getSlackFocusedGridClass(): string {
  return 'lg:grid-cols-[minmax(200px,40%)_minmax(180px,30%)_minmax(180px,30%)]'
}

/** Soft focus: active orchestration column ~40%. */
export function getOrchestrationFocusedGridClass(): string {
  return 'lg:grid-cols-[minmax(180px,30%)_minmax(200px,40%)_minmax(180px,30%)]'
}

/** Soft focus: active risk column ~40% (complete uses 50%). */
export function getRiskFocusedGridClass(): string {
  return 'lg:grid-cols-[minmax(180px,30%)_minmax(180px,30%)_minmax(220px,40%)]'
}

export function getFocusedZone(state: SlackRevenueDemoState): DemoZone | null {
  const zones: DemoZone[] = ['slack', 'orchestration', 'risk']
  return zones.find(z => getZoneVisualState(z, state) === 'active') ?? null
}

export function getDemoGridLayoutMode(
  state: SlackRevenueDemoState
): DemoGridLayoutMode {
  if (isCompleteState(state)) return 'slack-focus'
  const focused = getFocusedZone(state)
  if (focused === 'slack') return 'slack-focus'
  if (focused === 'orchestration') return 'orchestration-focus'
  if (focused === 'risk') return 'risk-focus'
  return 'default'
}

export function getDemoGridClass(state: SlackRevenueDemoState): string {
  const mode = getDemoGridLayoutMode(state)
  switch (mode) {
    case 'complete':
      return getCompleteGridClass()
    case 'slack-focus':
      return getSlackFocusedGridClass()
    case 'orchestration-focus':
      return getOrchestrationFocusedGridClass()
    case 'risk-focus':
      return getRiskFocusedGridClass()
    default:
      return getDefaultGridClass()
  }
}

export function getGovernanceHighlightEvent(
  state: SlackRevenueDemoState
): string | null {
  if (isCompleteState(state)) {
    return 'agent.reply.sent'
  }
  return null
}

export function shouldShowSupplementalTimelineHints(
  state: SlackRevenueDemoState
): boolean {
  return !isCompleteState(state)
}
