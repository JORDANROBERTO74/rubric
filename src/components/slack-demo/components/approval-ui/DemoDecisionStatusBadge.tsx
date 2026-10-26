'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Activity, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEMO_EASE } from './motionConstants'

export type DemoDecisionStatus = 'pending' | 'active' | 'approved'

const STYLES: Record<DemoDecisionStatus, string> = {
  pending: 'bg-muted text-muted-foreground border-border',
  active: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

const ICONS = {
  pending: Clock,
  active: Activity,
  approved: CheckCircle2
} as const

const LABELS: Record<DemoDecisionStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  approved: 'Approved'
}

type DemoDecisionStatusBadgeProps = {
  status: DemoDecisionStatus
  className?: string
}

export function DemoDecisionStatusBadge({
  status,
  className
}: DemoDecisionStatusBadgeProps) {
  const reduceMotion = useReducedMotion()
  const Icon = ICONS[status]

  return (
    <span
      className={cn(
        'relative inline-flex h-7 min-w-[5.5rem] shrink-0 overflow-hidden rounded-full',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: DEMO_EASE }}
          className={cn(
            'inline-flex h-full w-full items-center justify-center gap-1.5 border px-2.5 py-1 text-xs font-medium',
            STYLES[status]
          )}
        >
          <Icon size={12} aria-hidden />
          <span>{LABELS[status]}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
