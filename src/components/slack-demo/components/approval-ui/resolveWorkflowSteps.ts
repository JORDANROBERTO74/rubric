import { getApprovalCardVisualState } from '../../approvalState'
import type {
  ApprovalPhase,
  ComponentVisualState,
  SlackRevenueDemoState
} from '../../types'
import type { DemoWorkflowStep, DemoWorkflowStepStatus } from './types'

function visualStateToStepStatus(
  visualState: ComponentVisualState
): DemoWorkflowStepStatus | null {
  if (visualState === 'idle') return null
  if (visualState === 'active') return 'current'
  return 'completed'
}

type ResolveWorkflowStepsParams = {
  steps: DemoWorkflowStep[]
  currentState: SlackRevenueDemoState
  phase: ApprovalPhase
  cardStagger: number
  reduceMotion: boolean
}

export function resolveVisibleWorkflowSteps({
  steps,
  currentState,
  phase,
  cardStagger,
  reduceMotion
}: ResolveWorkflowStepsParams): DemoWorkflowStep[] {
  const resolved: DemoWorkflowStep[] = []

  for (let index = 0; index < steps.length; index++) {
    const visualState = getApprovalCardVisualState(
      index,
      cardStagger,
      phase,
      currentState,
      reduceMotion
    )
    const status = visualStateToStepStatus(visualState)
    if (!status) continue

    resolved.push({
      ...steps[index],
      status
    })
  }

  return resolved
}

export function resolveAllCompletedWorkflowSteps(
  steps: DemoWorkflowStep[]
): DemoWorkflowStep[] {
  return steps.map(step => ({ ...step, status: 'completed' as const }))
}
