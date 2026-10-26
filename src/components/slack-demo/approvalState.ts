import type {
  ApprovalPhase,
  ComponentVisualState,
  SlackRevenueDemoState
} from './types'
import { stateRank } from './zoneState'

export function shouldShowApprovalTimelineHint(
  state: SlackRevenueDemoState
): boolean {
  return stateRank(state) >= stateRank('approval_or_action_selected')
}

export function shouldShowApprovalCheckpoint(
  state: SlackRevenueDemoState,
  phase: ApprovalPhase
): boolean {
  if (stateRank(state) < stateRank('approval_or_action_selected')) {
    return false
  }
  return phase === 'cards' || phase === 'complete'
}

/** @deprecated Use shouldShowApprovalCheckpoint */
export function shouldShowEscalationCheckpoint(
  state: SlackRevenueDemoState
): boolean {
  return stateRank(state) >= stateRank('approval_or_action_selected')
}

export function resolveApprovalPhase(
  currentState: SlackRevenueDemoState,
  phaseStagger: number,
  reduceMotion: boolean
): ApprovalPhase {
  if (stateRank(currentState) < stateRank('approval_or_action_selected')) {
    return 'hidden'
  }

  if (stateRank(currentState) > stateRank('approval_or_action_selected')) {
    return 'complete'
  }

  if (reduceMotion) {
    return 'complete'
  }

  if (phaseStagger === 0) return 'hidden'
  if (phaseStagger >= 3) return 'complete'
  return 'cards'
}

export function getApprovalCardVisualState(
  cardIndex: number,
  cardStagger: number,
  phase: ApprovalPhase,
  currentState: SlackRevenueDemoState,
  reduceMotion: boolean
): ComponentVisualState {
  if (phase === 'hidden') {
    return 'idle'
  }

  if (stateRank(currentState) > stateRank('approval_or_action_selected')) {
    return 'complete'
  }

  if (reduceMotion) {
    return cardIndex <= cardStagger ? 'complete' : 'idle'
  }

  if (phase === 'complete') {
    if (cardIndex < cardStagger) return 'complete'
    if (cardIndex === cardStagger) return 'complete'
    return 'idle'
  }

  if (cardIndex < cardStagger) return 'complete'
  if (cardIndex === cardStagger) return 'active'
  return 'idle'
}
