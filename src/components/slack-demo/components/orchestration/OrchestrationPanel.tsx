'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  applyPreviewErrorToStepLogs,
  getStepLogDelayMs,
  getVisibleStepLogs,
  resolveDemoExecutionStatus,
  shouldShowOrchestrationBody
} from '../../fixtures/executionUiFixtures'
import { getFocusedZone } from '../../completeState'
import type { ScenarioBundle, SlackRevenueDemoState } from '../../types'
import { getZoneVisualState, stateRank } from '../../zoneState'
import { useFollowScroll } from '../../useFollowScroll'
import DemoPanel from '../placeholders/DemoPanel'
import { DemoExecutionHeader } from '../execution-ui/DemoExecutionHeader'
import { DemoStepLogsPanel } from '../execution-ui/DemoStepLogsPanel'

type OrchestrationPanelProps = {
  bundle: ScenarioBundle
  currentState: SlackRevenueDemoState
  runId?: number
  className?: string
  reduceMotion: boolean
  previewErrorStates?: boolean
}

export default function OrchestrationPanel({
  bundle,
  currentState,
  runId = 0,
  className,
  reduceMotion,
  previewErrorStates = false
}: OrchestrationPanelProps) {
  const visualState = getZoneVisualState('orchestration', currentState)
  const stepLogCount = bundle.executionUi.stepLogs.length
  const [stepLogStagger, setStepLogStagger] = useState(0)
  const followEnabled = getFocusedZone(currentState) === 'orchestration'

  const { containerRef, bottomRef, onScroll, resetFollow } = useFollowScroll(
    [currentState, runId, stepLogStagger, followEnabled],
    { enabled: followEnabled, reduceMotion: !!reduceMotion }
  )

  useEffect(() => {
    resetFollow()
  }, [runId, resetFollow])

  useEffect(() => {
    if (reduceMotion) {
      setStepLogStagger(
        stateRank(currentState) >= stateRank('sources_querying')
          ? stepLogCount
          : 0
      )
      return
    }

    if (stateRank(currentState) < stateRank('sources_querying')) {
      setStepLogStagger(0)
      return
    }

    if (stateRank(currentState) >= stateRank('evidence_synthesizing')) {
      setStepLogStagger(stepLogCount)
      return
    }

    setStepLogStagger(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= stepLogCount; i++) {
      timers.push(
        setTimeout(
          () => setStepLogStagger(i),
          getStepLogDelayMs(i, stepLogCount)
        )
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [currentState, runId, reduceMotion, stepLogCount])

  const executionStatus = resolveDemoExecutionStatus(currentState)
  const showBody = shouldShowOrchestrationBody(currentState)

  const stepLogs = useMemo(() => {
    const visible = getVisibleStepLogs(
      bundle.executionUi.stepLogs,
      currentState,
      stepLogStagger,
      reduceMotion
    )
    return applyPreviewErrorToStepLogs(visible, previewErrorStates)
  }, [
    bundle.executionUi.stepLogs,
    currentState,
    stepLogStagger,
    reduceMotion,
    previewErrorStates
  ])

  const headerData = useMemo(
    () => ({
      ...bundle.executionUi.header,
      status: executionStatus
    }),
    [bundle.executionUi.header, executionStatus]
  )

  const awaitingSources =
    showBody &&
    stepLogs.length === 0 &&
    stateRank(currentState) < stateRank('sources_querying')

  return (
    <DemoPanel
      title="Rubric orchestration"
      visualState={visualState}
      ariaLabel="Rubric orchestration"
      className={cn('h-full', className)}
      bodyScrollRef={containerRef}
      onBodyScroll={onScroll}
    >
      {!showBody ? (
        <p className="text-sm text-muted-foreground">
          Waiting for mention routing…
        </p>
      ) : (
        <section className="min-w-0 w-full space-y-0 text-sm">
          <DemoExecutionHeader data={headerData} />
          <DemoStepLogsPanel
            stepLogs={stepLogs}
            isLive={currentState === 'sources_querying'}
            awaitingSources={awaitingSources}
            reduceMotion={reduceMotion}
          />
        </section>
      )}
      <span ref={bottomRef} className="block h-0 w-full shrink-0" aria-hidden />
    </DemoPanel>
  )
}
