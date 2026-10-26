'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RubricMark } from '@/components/brand/mark'
import {
  getSlackMessageDelayMs,
  MENTION_TOKEN,
  REPLY_CROSSFADE_DELAY_MS,
  REPLY_CROSSFADE_DURATION_MS,
  SLACK_AGENT_AUTHOR
} from '../../constants'
import { getFocusedZone } from '../../completeState'
import {
  buildAgentThreadMessage,
  getMessageVisualState,
  resolveAgentReplyPhase,
  shouldPulseMention,
  shouldShowAgentThreadMessage,
  shouldShowEventReceived,
  shouldShowSlackAgentReplyBlock,
  type ReplyStagger
} from '../../slackThreadState'
import type { ScenarioBundle, SlackRevenueDemoState } from '../../types'
import { getZoneVisualState, stateRank } from '../../zoneState'
import { useFollowScroll } from '../../useFollowScroll'
import DemoPanel from '../placeholders/DemoPanel'
import SlackAgentReply from './SlackAgentReply'
import SlackMessageBubble from './SlackMessageBubble'
import SlackThreadComposer from './SlackThreadComposer'

type SlackThreadMockProps = {
  bundle: ScenarioBundle
  currentState: SlackRevenueDemoState
  runId?: number
  dominant?: boolean
  className?: string
  reduceMotion: boolean
}

export default function SlackThreadMock({
  bundle,
  currentState,
  runId = 0,
  dominant = false,
  className,
  reduceMotion
}: SlackThreadMockProps) {
  const visualState = getZoneVisualState('slack', currentState)

  const messageCount = bundle.data.slackMessages.length

  const [staggerCount, setStaggerCount] = useState(0)
  const [replyStagger, setReplyStagger] = useState<ReplyStagger>(0)

  useEffect(() => {
    if (reduceMotion) {
      setStaggerCount(
        stateRank(currentState) >= stateRank('slack_thread_active')
          ? messageCount
          : 0
      )
      return
    }

    if (stateRank(currentState) < stateRank('slack_thread_active')) {
      setStaggerCount(0)
      return
    }

    if (stateRank(currentState) >= stateRank('mention_detected')) {
      setStaggerCount(messageCount)
      return
    }

    setStaggerCount(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= messageCount; i++) {
      timers.push(
        setTimeout(
          () => setStaggerCount(i),
          getSlackMessageDelayMs(i, messageCount)
        )
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [currentState, runId, reduceMotion, messageCount])

  useEffect(() => {
    if (reduceMotion) {
      setReplyStagger(
        stateRank(currentState) >= stateRank('slack_reply_sent') ? 2 : 0
      )
      return
    }

    if (stateRank(currentState) < stateRank('slack_reply_sent')) {
      setReplyStagger(0)
      return
    }

    if (stateRank(currentState) > stateRank('slack_reply_sent')) {
      setReplyStagger(2)
      return
    }

    setReplyStagger(0)
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setReplyStagger(1), REPLY_CROSSFADE_DELAY_MS),
      setTimeout(
        () => setReplyStagger(2),
        REPLY_CROSSFADE_DELAY_MS + REPLY_CROSSFADE_DURATION_MS
      )
    ]
    return () => timers.forEach(clearTimeout)
  }, [currentState, runId, reduceMotion])

  const visibleCount = (() => {
    if (stateRank(currentState) >= stateRank('mention_detected')) {
      return messageCount
    }
    if (stateRank(currentState) >= stateRank('slack_thread_active')) {
      return reduceMotion ? messageCount : staggerCount
    }
    return 0
  })()

  const replyPhase = resolveAgentReplyPhase(
    currentState,
    replyStagger,
    !!reduceMotion
  )

  const showAgentBubble = shouldShowAgentThreadMessage(currentState)
  const humanMessages = bundle.data.slackMessages.slice(0, visibleCount)
  const threadMessages = showAgentBubble
    ? [...humanMessages, buildAgentThreadMessage(bundle.data.agentResult)]
    : humanMessages

  const followEnabled = getFocusedZone(currentState) === 'slack'

  const { containerRef, bottomRef, onScroll, resetFollow } = useFollowScroll(
    [visibleCount, showAgentBubble, replyPhase, currentState, runId, followEnabled],
    { enabled: followEnabled, reduceMotion: !!reduceMotion }
  )

  useEffect(() => {
    resetFollow()
  }, [runId, resetFollow])

  return (
    <DemoPanel
      title="Thread"
      visualState={visualState}
      ariaLabel="Decision thread"
      scrollMode="inner"
      className={cn(
        'h-full min-h-0',
        dominant && 'lg:ring-2 lg:ring-primary/30 lg:shadow-md',
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-md border border-border/60 bg-muted/10">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-muted/50 px-2 py-1.5">
          <div className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
          </div>
          <RubricMark
            className="h-3.5 w-3.5 shrink-0 opacity-80"
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {bundle.data.channel}
          </span>
          {shouldShowEventReceived(currentState) && (
            <Badge
              variant="outline"
              className="ml-auto text-[10px] font-normal"
            >
              event received
            </Badge>
          )}
          {stateRank(currentState) >= stateRank('slack_reply_sent') && (
            <Badge
              variant="secondary"
              className={cn(
                'shrink-0 text-[10px] font-normal',
                !shouldShowEventReceived(currentState) && 'ml-auto'
              )}
            >
              reply sent
            </Badge>
          )}
        </div>

        <div
          ref={containerRef}
          onScroll={onScroll}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2 pl-2 pr-3 sm:py-3 sm:pl-3 sm:pr-4 [scrollbar-gutter:stable]"
        >
          <ul className="space-y-3" aria-label="Thread messages" role="list">
            {threadMessages.map((msg, index) => {
              const isAgent = msg.author === SLACK_AGENT_AUTHOR
              const messageVisualState = isAgent
                ? 'complete'
                : getMessageVisualState(index, visibleCount)

              return (
                <SlackMessageBubble
                  key={`${bundle.id}-${runId}-${msg.id}`}
                  author={msg.author}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  visualState={messageVisualState}
                  variant={isAgent ? 'agent' : 'default'}
                  mentionPulse={
                    !isAgent &&
                    shouldPulseMention(currentState) &&
                    msg.content.includes(MENTION_TOKEN)
                  }
                />
              )
            })}
          </ul>

          {shouldShowSlackAgentReplyBlock(currentState) && (
            <SlackAgentReply
              phase={replyPhase}
              agentReplyFinal={bundle.data.agentResult}
            />
          )}

          <div ref={bottomRef} className="h-0 w-full shrink-0" aria-hidden />
        </div>

        <SlackThreadComposer placeholder={bundle.slackComposerPlaceholder} />
      </div>
    </DemoPanel>
  )
}
