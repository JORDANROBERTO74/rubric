'use client'

import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Terminal } from 'lucide-react'
import { STEP_LOG_CARD_ENTER_STAGGER_MS } from '../../fixtures/executionUiFixtures'
import { DemoStepLogCard } from './DemoStepLogCard'
import type { DemoStepLog } from './types'

type DemoStepLogsPanelProps = {
  stepLogs: DemoStepLog[]
  isLive: boolean
  awaitingSources?: boolean
  reduceMotion?: boolean
}

function AwaitingSourcesPlaceholder({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section
      aria-label="Preparing source queries"
      className="min-w-0 w-full space-y-2"
    >
      <p className="text-sm text-muted-foreground">
        Route verified — preparing live source queries…
      </p>
      <ul className="list-none space-y-2 p-0" aria-hidden>
        {[0, 1, 2].map(index => (
          <li
            key={index}
            className="h-12 animate-pulse rounded-lg border border-dashed border-border/80 bg-muted/30"
            style={
              reduceMotion
                ? undefined
                : { animationDelay: `${index * 180}ms` }
            }
          />
        ))}
      </ul>
    </section>
  )
}

export function DemoStepLogsPanel({
  stepLogs,
  isLive,
  awaitingSources = false,
  reduceMotion: reduceMotionProp
}: DemoStepLogsPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = reduceMotionProp ?? !!prefersReducedMotion

  if (awaitingSources) {
    return <AwaitingSourcesPlaceholder reduceMotion={reduceMotion} />
  }

  if (stepLogs.length === 0) {
    if (isLive) {
      return null
    }
    return (
      <p className="text-sm text-muted-foreground">Waiting for live sources…</p>
    )
  }

  const successCount = stepLogs.filter(log => log.status === 'success').length
  const errorCount = stepLogs.filter(log => log.status === 'error').length
  const runningCount = stepLogs.filter(log => log.status === 'running').length

  return (
    <section
      aria-label="Execution step log (demo)"
      className="min-w-0 w-full max-w-full"
    >
      <section className="min-w-0 w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <header className="min-w-0 border-b border-border px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Terminal size={12} className="shrink-0" />
            Execution step log
          </p>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
              }`}
            />
            <span className="min-w-0">
              {isLive ? 'Live execution' : 'Execution complete'}
              {isLive && runningCount > 0 && !reduceMotion && (
                <span className="text-amber-700"> · querying</span>
              )}
            </span>
          </p>
          <ul className="mt-2 flex min-w-0 list-none flex-wrap gap-1.5 p-0">
            <li>
              <Badge variant="outline" className="text-[10px] leading-none">
                {stepLogs.length} steps
              </Badge>
            </li>
            <li>
              <Badge variant="outline" className="text-[10px] leading-none">
                {successCount} succeeded
              </Badge>
            </li>
            {errorCount > 0 && (
              <li>
                <Badge
                  variant="outline"
                  className="border-red-200 bg-red-50 text-[10px] leading-none text-red-700"
                >
                  {errorCount} failed
                </Badge>
              </li>
            )}
          </ul>
        </header>

        <ul className="list-none space-y-2 p-2.5">
          <AnimatePresence initial={false} mode="popLayout">
            {stepLogs.map((stepLog, index) => (
              <DemoStepLogCard
                key={stepLog.id}
                stepLog={stepLog}
                reduceMotion={reduceMotion}
                enterDelayMs={
                  reduceMotion ? 0 : index * STEP_LOG_CARD_ENTER_STAGGER_MS
                }
              />
            ))}
          </AnimatePresence>
        </ul>
      </section>
    </section>
  )
}
