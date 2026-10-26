'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AGENT_REPLY_STUB } from '../../constants'
import { shouldShowReplyShimmer } from '../../slackThreadState'
import type { AgentReplyPhase } from '../../types'

const CROSSFADE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type SlackAgentReplyProps = {
  phase: AgentReplyPhase
  agentReplyFinal: string
}

export default function SlackAgentReply({
  phase,
  agentReplyFinal
}: SlackAgentReplyProps) {
  const reduceMotion = useReducedMotion()
  const showShimmer = shouldShowReplyShimmer(phase) && !reduceMotion
  const isBusy = phase === 'stub' || phase === 'crossfading'

  const showStub = phase === 'stub' || phase === 'crossfading'
  const showFinal = phase === 'crossfading' || phase === 'final'

  const fadeMs = reduceMotion ? 0 : 0.45

  return (
    <section
      className="shrink-0 border-t border-border/60 bg-muted/20 p-2 text-xs"
      aria-live="polite"
      aria-busy={isBusy}
      aria-label="Rubric agent reply"
    >
      <span className="font-semibold text-foreground">Rubric</span>
      <div className="relative mt-1 min-w-0">
        <div className="grid min-w-0 [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
          {showStub && (
            <motion.p
              initial={false}
              animate={{
                opacity: phase === 'crossfading' ? 0 : 1
              }}
              transition={{ duration: fadeMs, ease: CROSSFADE_EASE }}
              className={cn(
                'm-0 min-w-0 text-pretty leading-relaxed text-muted-foreground',
                showShimmer && 'animate-pulse',
                phase === 'crossfading' && 'pointer-events-none select-none'
              )}
              aria-hidden={phase === 'crossfading'}
            >
              {AGENT_REPLY_STUB}
            </motion.p>
          )}
          {showFinal && (
            <motion.p
              initial={
                reduceMotion || phase === 'final' ? false : { opacity: 0 }
              }
              animate={{ opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: CROSSFADE_EASE
              }}
              className={cn(
                'm-0 min-w-0 text-pretty leading-relaxed text-foreground/90',
                phase === 'crossfading' && showStub && 'pointer-events-none'
              )}
            >
              {agentReplyFinal}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
