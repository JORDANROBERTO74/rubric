import type {
  DemoExecutionStatus,
  DemoStepLog,
  DemoStepLogStatus
} from '../components/execution-ui/types'
import type { SlackRevenueDemoState } from '../types'
import { stateRank } from '../zoneState'

/** Time budget for step log reveals during `sources_querying`. */
export const SOURCES_QUERYING_STEP_WINDOW_MS = 4200
/** Beat before the first step log mounts. */
export const STEP_LOG_FIRST_MS = 150
/** Hold on the last "Running" step before `evidence_synthesizing`. */
export const STEP_LOG_LAST_HOLD_MS = 350

/** Even spacing between step log reveals within the querying window. */
export function getStepLogStaggerMs(stepCount: number): number {
  if (stepCount <= 1) return 0
  const span = SOURCES_QUERYING_STEP_WINDOW_MS - STEP_LOG_FIRST_MS
  return Math.round(span / (stepCount - 1))
}

/** 1-based step index → delay from `sources_querying` scene start. */
export function getStepLogDelayMs(
  stepIndex: number,
  stepCount: number
): number {
  if (stepCount <= 0 || stepIndex < 1) return 0
  if (stepCount === 1) return STEP_LOG_FIRST_MS
  if (stepIndex === 1) return STEP_LOG_FIRST_MS
  const span = SOURCES_QUERYING_STEP_WINDOW_MS - STEP_LOG_FIRST_MS
  return (
    STEP_LOG_FIRST_MS +
    Math.round((span * (stepIndex - 1)) / (stepCount - 1))
  )
}

export function getSourcesQueryingSceneMs(stepCount: number): number {
  if (stepCount <= 0) {
    return SOURCES_QUERYING_STEP_WINDOW_MS + STEP_LOG_LAST_HOLD_MS
  }
  return getStepLogDelayMs(stepCount, stepCount) + STEP_LOG_LAST_HOLD_MS
}

/** @deprecated Use getStepLogStaggerMs(stepCount) */
export const STEP_LOG_STAGGER_MS = getStepLogStaggerMs(5)
/** Sub-stagger when a card mounts (polish on top of list reveal). */
export const STEP_LOG_CARD_ENTER_STAGGER_MS = 80
export const PREVIEW_ERROR_LOG_INDEX = 0

export function resolveDemoExecutionStatus(
  currentState: SlackRevenueDemoState
): DemoExecutionStatus {
  if (stateRank(currentState) >= stateRank('risk_detected')) {
    return 'success'
  }
  if (stateRank(currentState) >= stateRank('route_verified')) {
    return 'running'
  }
  return 'info'
}

export function shouldShowOrchestrationBody(
  currentState: SlackRevenueDemoState
): boolean {
  return stateRank(currentState) >= stateRank('route_verified')
}

function resolveStepLogStatus(
  index: number,
  visibleCount: number,
  currentState: SlackRevenueDemoState,
  baseStatus: DemoStepLogStatus
): DemoStepLogStatus {
  if (stateRank(currentState) >= stateRank('evidence_synthesizing')) {
    return 'success'
  }
  if (stateRank(currentState) < stateRank('sources_querying')) {
    return baseStatus
  }
  if (index < visibleCount - 1) return 'success'
  if (index === visibleCount - 1) return 'running'
  return baseStatus
}

export function getVisibleStepLogs(
  logs: DemoStepLog[],
  currentState: SlackRevenueDemoState,
  staggerCount: number,
  reduceMotion: boolean
): DemoStepLog[] {
  if (stateRank(currentState) < stateRank('sources_querying')) {
    return []
  }

  const fullCount =
    reduceMotion ||
    stateRank(currentState) >= stateRank('evidence_synthesizing')
      ? logs.length
      : Math.min(Math.max(staggerCount, 0), logs.length)

  return logs.slice(0, fullCount).map((log, index) => {
    const status = resolveStepLogStatus(
      index,
      fullCount,
      currentState,
      log.status
    )
    return {
      ...log,
      status,
      statusLabel:
        status === 'running'
          ? 'Running'
          : status === 'error'
            ? 'Failed'
            : 'Success'
    }
  })
}

export function applyPreviewErrorToStepLogs(
  logs: DemoStepLog[],
  previewErrorStates: boolean
): DemoStepLog[] {
  if (!previewErrorStates || logs.length === 0) return logs
  return logs.map((log, index) =>
    index === PREVIEW_ERROR_LOG_INDEX
      ? {
          ...log,
          status: 'error' as const,
          statusLabel: 'Failed',
          summary: `${log.summary} (preview error)`
        }
      : log
  )
}
