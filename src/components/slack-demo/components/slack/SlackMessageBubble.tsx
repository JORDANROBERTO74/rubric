'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ComponentVisualState } from '../../types'
import AgentMentionToken from './AgentMentionToken'
import { authorInitial, parseMentionSegments } from './slack-message-utils'

const ENTRY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type SlackMessageBubbleProps = {
  author: string
  content: string
  timestamp?: string
  visualState: ComponentVisualState
  mentionPulse?: boolean
  variant?: 'default' | 'agent'
}

function MessageContent({
  content,
  mentionPulse
}: {
  content: string
  mentionPulse?: boolean
}) {
  const segments = parseMentionSegments(content)

  return (
    <p className="mt-1 text-sm leading-relaxed text-foreground/90">
      {segments.map((segment, i) =>
        segment.type === 'mention' ? (
          <AgentMentionToken key={`m-${i}`} pulse={mentionPulse}>
            {segment.value}
          </AgentMentionToken>
        ) : (
          <span key={`t-${i}`}>{segment.value}</span>
        )
      )}
    </p>
  )
}

export default function SlackMessageBubble({
  author,
  content,
  timestamp,
  visualState,
  mentionPulse = false,
  variant = 'default'
}: SlackMessageBubbleProps) {
  const reduceMotion = useReducedMotion()

  if (visualState === 'idle') {
    return null
  }

  return (
    <motion.li
      role="listitem"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        ease: ENTRY_EASE
      }}
      className={cn('flex gap-3', visualState === 'active' && 'relative')}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-primary',
          variant === 'agent' ? 'bg-primary/25' : 'bg-primary/15'
        )}
        aria-hidden
      >
        {authorInitial(author)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {author}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        <MessageContent content={content} mentionPulse={mentionPulse} />
      </div>
    </motion.li>
  )
}
