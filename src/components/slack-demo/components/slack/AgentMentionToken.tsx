'use client'

import { cn } from '@/lib/utils'
import type { ComponentVisualState } from '../../types'

type AgentMentionTokenProps = {
  children: string
  visualState?: ComponentVisualState
  pulse?: boolean
}

export default function AgentMentionToken({
  children,
  visualState = 'complete',
  pulse = false
}: AgentMentionTokenProps) {
  return (
    <span
      aria-label="Agent mention retention"
      className={cn(
        'rounded bg-primary/15 px-0.5 font-medium text-primary',
        visualState === 'active' && 'ring-1 ring-primary/40',
        pulse && 'animate-pulse'
      )}
    >
      {children}
    </span>
  )
}
