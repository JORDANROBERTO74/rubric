'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  APPROVAL_CARD_STAGGER_MS,
  APPROVAL_CARDS_START_MS,
  APPROVAL_DECISION_SETTLE_MS,
  APPROVAL_LAST_STEP_HOLD_MS,
  RISK_BUILD_INITIAL_MS,
  RISK_BUILD_STAGGER_MS,
  RISK_MAX_BUILD_STEP
} from '../../constants'
import {
  resolveApprovalPhase,
  shouldShowApprovalCheckpoint
} from '../../approvalState'
import { getFocusedZone } from '../../completeState'
import {
  resolveRiskBuildStep,
  shouldShowRiskAwaiting,
  shouldShowRiskSummary
} from '../../riskState'
import type { ScenarioBundle, SlackRevenueDemoState } from '../../types'
import { getZoneVisualState, stateRank } from '../../zoneState'
import { useFollowScroll } from '../../useFollowScroll'
import DemoPanel from '../placeholders/DemoPanel'
import { DemoEscalationPanel } from '../approval-ui/DemoEscalationPanel'
import { DemoRiskAssessmentPanel } from '../risk-ui/DemoRiskAssessmentPanel'
type RiskPanelProps = {
  bundle: ScenarioBundle
  currentState: SlackRevenueDemoState
  runId?: number
  dominant?: boolean
  className?: string
  reduceMotion: boolean
}

export default function RiskPanel({
  bundle,
  currentState,
  runId = 0,
  dominant = false,
  className,
  reduceMotion
}: RiskPanelProps) {
  const visualState = getZoneVisualState('risk', currentState)
  const approvalCardCount = bundle.approvalUi.workflowSteps.length
  const [buildStagger, setBuildStagger] = useState(0)
  const [phaseStagger, setPhaseStagger] = useState(0)
  const [cardStagger, setCardStagger] = useState(-1)
  const followEnabled = getFocusedZone(currentState) === 'risk'

  const buildStep = resolveRiskBuildStep(
    currentState,
    buildStagger,
    !!reduceMotion
  )

  const approvalPhase = resolveApprovalPhase(
    currentState,
    phaseStagger,
    !!reduceMotion
  )

  const { containerRef, bottomRef, onScroll, resetFollow } = useFollowScroll(
    [currentState, runId, buildStep, approvalPhase, cardStagger, followEnabled],
    { enabled: followEnabled, reduceMotion: !!reduceMotion }
  )

  useEffect(() => {
    resetFollow()
  }, [runId, resetFollow])

  useEffect(() => {
    if (reduceMotion) {
      setBuildStagger(
        stateRank(currentState) >= stateRank('risk_detected')
          ? RISK_MAX_BUILD_STEP
          : 0
      )
      return
    }

    if (stateRank(currentState) < stateRank('risk_detected')) {
      setBuildStagger(0)
      return
    }

    if (stateRank(currentState) > stateRank('risk_detected')) {
      setBuildStagger(RISK_MAX_BUILD_STEP)
      return
    }

    setBuildStagger(-1)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i <= RISK_MAX_BUILD_STEP; i++) {
      timers.push(
        setTimeout(
          () => setBuildStagger(i),
          RISK_BUILD_INITIAL_MS + RISK_BUILD_STAGGER_MS * i
        )
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [currentState, runId, reduceMotion])

  useEffect(() => {
    if (reduceMotion) {
      setPhaseStagger(
        stateRank(currentState) >= stateRank('approval_or_action_selected')
          ? 3
          : 0
      )
      setCardStagger(
        stateRank(currentState) >= stateRank('approval_or_action_selected')
          ? approvalCardCount - 1
          : -1
      )
      return
    }

    if (stateRank(currentState) < stateRank('approval_or_action_selected')) {
      setPhaseStagger(0)
      setCardStagger(-1)
      return
    }

    if (stateRank(currentState) > stateRank('approval_or_action_selected')) {
      setPhaseStagger(3)
      setCardStagger(approvalCardCount - 1)
      return
    }

    setPhaseStagger(0)
    setCardStagger(-1)

    const firstStepAt =
      APPROVAL_CARDS_START_MS + APPROVAL_DECISION_SETTLE_MS
    const lastStepAt =
      firstStepAt + APPROVAL_CARD_STAGGER_MS * Math.max(0, approvalCardCount - 1)

    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => {
        setPhaseStagger(1)
        setCardStagger(-1)
      }, APPROVAL_CARDS_START_MS)
    ]

    for (let i = 0; i < approvalCardCount; i++) {
      timers.push(
        setTimeout(() => setCardStagger(i), firstStepAt + APPROVAL_CARD_STAGGER_MS * i)
      )
    }

    timers.push(setTimeout(() => setPhaseStagger(2), lastStepAt))

    timers.push(
      setTimeout(
        () => setPhaseStagger(3),
        lastStepAt + APPROVAL_LAST_STEP_HOLD_MS
      )
    )

    return () => timers.forEach(clearTimeout)
  }, [currentState, runId, reduceMotion, approvalCardCount])

  return (
    <DemoPanel
      title="Revenue risk"
      visualState={visualState}
      ariaLabel="Revenue risk summary"
      className={cn(
        'h-full min-h-0',
        dominant && 'lg:ring-2 lg:ring-primary/30 lg:shadow-md',
        className
      )}
      bodyScrollRef={containerRef}
      onBodyScroll={onScroll}
    >
      <div className="min-w-0 w-full space-y-3 text-sm">
        {shouldShowRiskAwaiting(currentState) && (
          <p className="text-sm text-muted-foreground">Synthesizing risk…</p>
        )}

        {!shouldShowRiskAwaiting(currentState) &&
          !shouldShowRiskSummary(currentState) && (
            <p className="text-sm text-muted-foreground">
              Awaiting evidence synthesis…
            </p>
          )}

        {shouldShowRiskSummary(currentState) && (
          <DemoRiskAssessmentPanel
            riskUi={bundle.riskUi}
            buildStep={buildStep}
            reduceMotion={reduceMotion}
          />
        )}

        {shouldShowApprovalCheckpoint(currentState, approvalPhase) && (
          <DemoEscalationPanel
            decision={bundle.approvalUi.decision}
            workflowSteps={bundle.approvalUi.workflowSteps}
            currentState={currentState}
            phase={approvalPhase}
            cardStagger={cardStagger}
            reduceMotion={!!reduceMotion}
          />
        )}

        <div ref={bottomRef} className="h-0 w-full shrink-0" aria-hidden />
      </div>
    </DemoPanel>
  )
}
