'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import type { DemoStepLog, DemoStepLogStatus } from './types'

const ENTRY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type DemoStepLogCardProps = {
  stepLog: DemoStepLog
  reduceMotion?: boolean
  enterDelayMs?: number
}

function getStepCardClassName(status: DemoStepLogStatus) {
  if (status === 'success') {
    return 'border-emerald-200/80 bg-emerald-50/40'
  }
  if (status === 'running') {
    return 'border-amber-300/90 bg-amber-50/50'
  }
  return 'border-red-200/80 bg-red-50/40'
}

function getStatusBadgeClassName(status: DemoStepLogStatus) {
  if (status === 'success') {
    return 'border-emerald-200 text-emerald-700 bg-emerald-50'
  }
  if (status === 'running') {
    return 'border-amber-200 text-amber-700 bg-amber-50'
  }
  return 'border-red-200 text-red-700 bg-red-50'
}

function getMethodBadgeClassName(method: string) {
  if (method === 'GET') return 'border-blue-200 bg-blue-50 text-blue-700'
  if (method === 'POST') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return 'border-border bg-background text-muted-foreground'
}

function StepStatusIcon({
  status,
  reduceMotion
}: {
  status: DemoStepLogStatus
  reduceMotion: boolean
}) {
  if (status === 'running') {
    return (
      <Loader2
        size={16}
        className={cn('text-amber-600', !reduceMotion && 'animate-spin')}
        aria-hidden
      />
    )
  }
  if (status === 'success') {
    return (
      <motion.span
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: ENTRY_EASE }}
        className="inline-flex shrink-0"
      >
        <CheckCircle2 size={16} className="text-emerald-600" aria-hidden />
      </motion.span>
    )
  }
  return <XCircle size={16} className="text-red-600" aria-hidden />
}

export function DemoStepLogCard({
  stepLog,
  reduceMotion: reduceMotionProp,
  enterDelayMs = 0
}: DemoStepLogCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = reduceMotionProp ?? !!prefersReducedMotion
  const isRunning = stepLog.status === 'running'

  return (
    <motion.li
      role="listitem"
      aria-label={`Step ${stepLog.stepNumber}: ${stepLog.statusLabel}`}
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        layout: { duration: reduceMotion ? 0 : 0.35, ease: ENTRY_EASE },
        opacity: { duration: reduceMotion ? 0 : 0.42, ease: ENTRY_EASE },
        y: { duration: reduceMotion ? 0 : 0.48, ease: ENTRY_EASE },
        scale: { duration: reduceMotion ? 0 : 0.4, ease: ENTRY_EASE },
        delay: reduceMotion ? 0 : enterDelayMs / 1000
      }}
      className={cn(
        'relative w-full min-w-0 max-w-full overflow-hidden rounded-lg border p-2.5 shadow-sm transition-[border-color,background-color,box-shadow] duration-300',
        getStepCardClassName(stepLog.status),
        isRunning && !reduceMotion && 'ring-1 ring-amber-400/30'
      )}
    >
      {isRunning && !reduceMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <span className="slack-demo-step-log-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
        </span>
      )}

      <article className="relative flex min-w-0 items-start gap-2">
        <span className="mt-0.5 shrink-0">
          <StepStatusIcon
            key={stepLog.status}
            status={stepLog.status}
            reduceMotion={reduceMotion}
          />
        </span>
        <section className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step {stepLog.stepNumber}
            </span>
            <span className="flex min-w-0 flex-wrap items-center gap-1">
              <Badge
                variant="outline"
                className={cn(
                  getStatusBadgeClassName(stepLog.status),
                  'shrink-0 text-[10px] leading-none'
                )}
              >
                {stepLog.statusLabel}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  getMethodBadgeClassName(stepLog.methodLabel),
                  'shrink-0 text-[10px] leading-none'
                )}
              >
                {stepLog.methodLabel}
              </Badge>
              <Badge
                variant="outline"
                className="shrink-0 border-border bg-background text-[10px] leading-none"
              >
                {isRunning && !reduceMotion ? '…' : stepLog.durationLabel}
              </Badge>
            </span>
          </div>
          <p className="mt-1.5 min-w-0 break-all font-mono text-[11px] leading-snug text-muted-foreground">
            <span className="font-semibold text-foreground">
              {stepLog.methodLabel}
            </span>{' '}
            {stepLog.pathLabel}
          </p>
          <p className="mt-1 break-words text-xs leading-relaxed text-foreground">
            {stepLog.summary}
          </p>
          {stepLog.detailSections && stepLog.detailSections.length > 0 && (
            <p className="mt-1 break-words text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground">
                {stepLog.detailSections[0].label}:
              </span>{' '}
              {isRunning && !reduceMotion ? (
                <span className="inline-block h-3 max-w-full animate-pulse rounded bg-muted align-middle" style={{ width: '6rem' }} />
              ) : (
                stepLog.detailSections[0].value
              )}
            </p>
          )}
        </section>
      </article>
    </motion.li>
  )
}
