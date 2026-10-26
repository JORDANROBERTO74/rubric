import { RISK_MAX_BUILD_STEP } from './constants'
import type { RiskBuildSection, SlackRevenueDemoState } from './types'
import { stateRank } from './zoneState'

export function shouldShowRiskAwaiting(state: SlackRevenueDemoState): boolean {
  return (
    stateRank(state) >= stateRank('evidence_synthesizing') &&
    stateRank(state) < stateRank('risk_detected')
  )
}

export function shouldShowRiskSummary(state: SlackRevenueDemoState): boolean {
  return stateRank(state) >= stateRank('risk_detected')
}

export function resolveRiskBuildStep(
  currentState: SlackRevenueDemoState,
  stagger: number,
  reduceMotion: boolean
): number {
  if (stateRank(currentState) < stateRank('risk_detected')) {
    return -1
  }

  if (stateRank(currentState) > stateRank('risk_detected')) {
    return RISK_MAX_BUILD_STEP
  }

  if (reduceMotion) {
    return RISK_MAX_BUILD_STEP
  }

  if (stagger < 0) return -1
  return Math.min(stagger, RISK_MAX_BUILD_STEP)
}

export function isRiskSectionVisible(
  section: RiskBuildSection,
  buildStep: number
): boolean {
  if (buildStep < 0) return false

  switch (section) {
    case 'grounding':
      return buildStep >= 0
    case 'details':
      return buildStep >= 1
    case 'summary':
      return buildStep >= 2
    default:
      return false
  }
}
