'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ScenarioId } from './types'
import { getScenarioBundle } from './scenarios'
import { useSceneEngine } from './useSceneEngine'
import {
  getDemoGridClass,
  getFocusedZone,
  isCompleteState
} from './completeState'
import { GRID_LAYOUT_EASE, GRID_LAYOUT_TRANSITION_MS } from './constants'
import SlackThreadMock from './components/slack/SlackThreadMock'
import OrchestrationPanel from './components/orchestration/OrchestrationPanel'
import RiskPanel from './components/risk/RiskPanel'

type SlackRevenueDemoProps = {
  initialScenario?: ScenarioId
  onScenarioChange?: (id: ScenarioId) => void
  /**
   * When true, scrolls the Slack column into view on scene complete.
   * Disable on long landing pages — scrollIntoView affects document scroll.
   */
  scrollToSlackOnComplete?: boolean
}

export default function SlackRevenueDemo({
  initialScenario = 'churn',
  onScenarioChange,
  scrollToSlackOnComplete = false
}: SlackRevenueDemoProps) {
  const [scenario, setScenario] = useState<ScenarioId>(initialScenario)
  const [runId, setRunId] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const effectiveReduceMotion = !!prefersReducedMotion

  const slackColumnRef = useRef<HTMLDivElement>(null)

  const bundle = useMemo(() => getScenarioBundle(scenario), [scenario])
  const panelKey = `${scenario}-${runId}`

  const replayRef = useRef<(() => void) | null>(null)

  const handleRunComplete = useCallback(() => {
    setScenario(prev => {
      const next: ScenarioId = prev === 'churn' ? 'migration' : 'churn'
      onScenarioChange?.(next)
      return next
    })
    setRunId(n => n + 1)
    replayRef.current?.()
  }, [onScenarioChange])

  const { currentState, replay } = useSceneEngine({
    reduceMotion: effectiveReduceMotion,
    onRunComplete: handleRunComplete
  })

  replayRef.current = replay

  const isComplete = isCompleteState(currentState)
  const slackFocused = getFocusedZone(currentState) === 'slack'
  const gridClass = getDemoGridClass(currentState)

  useEffect(() => {
    if (!scrollToSlackOnComplete || !isComplete) return
    slackColumnRef.current?.scrollIntoView({
      behavior: effectiveReduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
  }, [
    scrollToSlackOnComplete,
    isComplete,
    runId,
    effectiveReduceMotion
  ])

  const gridLayoutTransition = effectiveReduceMotion
    ? { layout: { duration: 0 } }
    : {
        layout: {
          duration: GRID_LAYOUT_TRANSITION_MS / 1000,
          ease: GRID_LAYOUT_EASE
        }
      }

  return (
    <div className="flex min-h-[480px] flex-col gap-4 p-4 sm:p-6">
      <motion.div
        layout
        transition={gridLayoutTransition}
        className={cn(
          'grid flex-1 gap-3 grid-cols-1 items-stretch lg:items-stretch',
          gridClass
        )}
      >
        <motion.div
          ref={slackColumnRef}
          className="order-1 flex min-h-0 min-w-0 flex-col"
        >
          <SlackThreadMock
            key={`slack-${panelKey}`}
            bundle={bundle}
            currentState={currentState}
            runId={runId}
            reduceMotion={effectiveReduceMotion}
            dominant={slackFocused}
          />
        </motion.div>
        <motion.div className="order-2 flex min-h-0 min-w-0 flex-col">
          <OrchestrationPanel
            key={`orch-${panelKey}`}
            bundle={bundle}
            currentState={currentState}
            runId={runId}
            reduceMotion={effectiveReduceMotion}
            className={cn(isComplete && 'lg:opacity-95')}
          />
        </motion.div>
        <motion.div className="order-3 flex min-h-0 min-w-0 flex-col">
          <RiskPanel
            key={`risk-${panelKey}`}
            bundle={bundle}
            currentState={currentState}
            runId={runId}
            reduceMotion={effectiveReduceMotion}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
