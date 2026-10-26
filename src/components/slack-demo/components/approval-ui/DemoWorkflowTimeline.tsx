'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DemoWorkflowStep, DemoWorkflowStepStatus } from './types'
import { DEMO_EASE } from './motionConstants'

type DemoWorkflowTimelineProps = {
  steps: DemoWorkflowStep[]
  reduceMotion?: boolean
  showAwaitingBadge?: boolean
  ariaLabel?: string
}

/** Fixed grid: dot | label | trailing (badge or check) — same geometry for every status. */
const ROW_GRID_CLASS =
  'grid grid-cols-[1.75rem_minmax(0,1fr)_4.5rem] items-center gap-x-2'

const DOT_STYLES: Record<DemoWorkflowStepStatus, string> = {
  pending: 'border-border bg-background',
  current:
    'border-amber-500 bg-background shadow-[0_0_0_4px_rgba(251,191,36,0.2)]',
  completed: 'border-emerald-500 bg-emerald-500'
}

type WorkflowStepRowProps = {
  step: DemoWorkflowStep
  reduceMotion: boolean
  showAwaitingBadge: boolean
  isLast: boolean
}

function WorkflowStepRow({
  step,
  reduceMotion,
  showAwaitingBadge,
  isLast
}: WorkflowStepRowProps) {
  const isCurrent = step.status === 'current'
  const isCompleted = step.status === 'completed'

  return (
    <motion.li
      role="listitem"
      layout={false}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
      transition={{ duration: 0.38, ease: DEMO_EASE }}
      className={cn('relative min-w-0', !isLast && 'pb-0.5')}
    >
      {isCurrent && (
        <motion.div
          aria-hidden
          className="absolute inset-0 -mx-0.5 rounded-lg"
          initial={false}
          animate={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
          transition={{ duration: 0.32, ease: DEMO_EASE }}
        />
      )}

      <div
        className={cn(
          ROW_GRID_CLASS,
          'relative z-[1] min-h-[2.25rem] py-1.5 pr-1'
        )}
      >
        <motion.div
          className="flex size-7 items-center justify-center justify-self-center"
          aria-hidden
          animate={{ scale: isCurrent ? 1.05 : 1 }}
          transition={{ duration: 0.28, ease: DEMO_EASE }}
        >
          <motion.div
            className={cn(
              'size-3 shrink-0 rounded-full border-2 transition-colors duration-300',
              DOT_STYLES[step.status]
            )}
            layout={false}
          />
        </motion.div>

        <span
          className={cn(
            'min-w-0 break-words text-xs leading-snug transition-colors duration-300',
            isCompleted && 'font-medium text-foreground',
            isCurrent && 'font-semibold text-foreground',
            step.status === 'pending' && 'text-muted-foreground'
          )}
        >
          {step.action}
        </span>

        <motion.div className="flex h-6 items-center justify-end justify-self-end">
          <AnimatePresence mode="wait" initial={false}>
            {isCurrent && showAwaitingBadge && (
              <motion.span
                key="progress"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: DEMO_EASE }}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-amber-600"
              >
                <Clock size={10} className="shrink-0" aria-hidden />
                <span className="truncate">In progress</span>
              </motion.span>
            )}
            {isCompleted && (
              <motion.span
                key="done"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.26, ease: DEMO_EASE }}
                className="inline-flex shrink-0 items-center justify-center"
              >
                <CheckCircle2
                  size={14}
                  className="text-emerald-500 opacity-80"
                  aria-hidden
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.li>
  )
}

export function DemoWorkflowTimeline({
  steps,
  reduceMotion: reduceMotionProp,
  showAwaitingBadge = true,
  ariaLabel = 'Escalation workflow'
}: DemoWorkflowTimelineProps) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = reduceMotionProp ?? !!prefersReducedMotion

  if (steps.length === 0) return null

  return (
    <section
      className="min-w-0 w-full rounded-xl border border-border bg-card p-3 shadow-sm"
      aria-label={ariaLabel}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Workflow trace
      </p>
      <motion.div
        className="relative"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: DEMO_EASE }}
      >
        <motion.div
          aria-hidden
          className="absolute bottom-2 left-[0.875rem] top-2 w-px -translate-x-1/2 bg-border"
        />
        <ul className="relative list-none space-y-0 p-0">
          <AnimatePresence initial={false} mode="sync">
            {steps.map((step, index) => (
              <WorkflowStepRow
                key={step.id}
                step={step}
                reduceMotion={reduceMotion}
                showAwaitingBadge={showAwaitingBadge}
                isLast={index === steps.length - 1}
              />
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </section>
  )
}
