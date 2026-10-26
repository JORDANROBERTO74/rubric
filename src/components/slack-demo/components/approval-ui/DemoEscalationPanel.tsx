'use client'

import { useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ApprovalPhase, SlackRevenueDemoState } from '../../types'
import { DemoConfidenceMeter } from './DemoConfidenceMeter'
import {
  DemoDecisionStatusBadge,
  type DemoDecisionStatus
} from './DemoDecisionStatusBadge'
import { DemoWorkflowTimeline } from './DemoWorkflowTimeline'
import {
  resolveAllCompletedWorkflowSteps,
  resolveVisibleWorkflowSteps
} from './resolveWorkflowSteps'
import type { DemoEscalationDecision, DemoWorkflowStep } from './types'
import {
  DEMO_EASE,
  escalationContainerVariants,
  escalationItemVariants
} from './motionConstants'

type DemoEscalationPanelProps = {
  decision: DemoEscalationDecision
  workflowSteps: DemoWorkflowStep[]
  currentState: SlackRevenueDemoState
  phase: ApprovalPhase
  cardStagger: number
  reduceMotion: boolean
}

function resolveDecisionStatus(
  phase: ApprovalPhase,
  cardStagger: number
): DemoDecisionStatus {
  if (phase === 'complete') return 'approved'
  if (cardStagger >= 0) return 'active'
  return 'pending'
}

export function DemoEscalationPanel({
  decision,
  workflowSteps,
  currentState,
  phase,
  cardStagger,
  reduceMotion: reduceMotionProp
}: DemoEscalationPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = reduceMotionProp ?? !!prefersReducedMotion

  const visibleSteps = useMemo(
    () =>
      resolveVisibleWorkflowSteps({
        steps: workflowSteps,
        currentState,
        phase,
        cardStagger,
        reduceMotion
      }),
    [workflowSteps, currentState, phase, cardStagger, reduceMotion]
  )

  const decisionStatus = resolveDecisionStatus(phase, cardStagger)
  const showTimeline = cardStagger >= 0 || phase === 'complete'

  return (
    <motion.section
      className="min-w-0 w-full space-y-3 border-t border-border pt-3"
      aria-live="polite"
      aria-label="Escalation checkpoint"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: DEMO_EASE }}
    >
      <motion.p
        className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.06 }}
      >
        Escalation checkpoint
      </motion.p>

      <motion.div
        className="min-w-0 w-full rounded-xl border border-border bg-muted/20 p-3 shadow-sm"
        variants={reduceMotion ? undefined : escalationContainerVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.div
          variants={reduceMotion ? undefined : escalationItemVariants}
          className="flex min-w-0 flex-wrap items-start justify-between gap-2"
        >
          <span className="max-w-full truncate rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {decision.context}
          </span>
          <DemoDecisionStatusBadge status={decisionStatus} />
        </motion.div>

        <motion.div
          variants={reduceMotion ? undefined : escalationItemVariants}
          className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-2"
        >
          <DemoConfidenceMeter
            value={decision.confidence}
            className="min-w-0 flex-1"
            animateIn={!reduceMotion}
          />
        </motion.div>

        <motion.h3
          variants={reduceMotion ? undefined : escalationItemVariants}
          className="mt-2 min-w-0 break-words text-sm font-bold leading-snug text-foreground"
        >
          {decision.summary}
        </motion.h3>
      </motion.div>

      <AnimatePresence initial={false}>
        {showTimeline && (
          <motion.div
            key="workflow-timeline"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: DEMO_EASE }}
            className="min-w-0 w-full"
          >
            <DemoWorkflowTimeline
              steps={visibleSteps}
              reduceMotion={reduceMotion}
              ariaLabel="Escalation workflow steps"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export function DemoEscalationTimelineComplete({
  workflowSteps,
  reduceMotion
}: {
  workflowSteps: DemoWorkflowStep[]
  reduceMotion?: boolean
}) {
  const steps = useMemo(
    () => resolveAllCompletedWorkflowSteps(workflowSteps),
    [workflowSteps]
  )

  return (
    <DemoWorkflowTimeline
      steps={steps}
      reduceMotion={reduceMotion}
      showAwaitingBadge={false}
      ariaLabel="Completed escalation workflow"
    />
  )
}
