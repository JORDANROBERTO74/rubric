import { SLACK_AGENT_AUTHOR } from './constants'
import type {
  AgentReplyPhase,
  ComponentVisualState,
  SlackRevenueDemoState,
  SlackThreadMessage
} from './types'
import { stateRank } from './zoneState'

export type SlackThreadScenarioConfig = {
  messageCount: number
  preMentionMessageCount: number
}

/** 0 = stub, 1 = crossfading, 2 = final */
export type ReplyStagger = 0 | 1 | 2

export function shouldShowEventReceived(state: SlackRevenueDemoState): boolean {
  return stateRank(state) >= stateRank('mention_detected')
}

export function shouldPulseMention(state: SlackRevenueDemoState): boolean {
  return state === 'mention_detected'
}

/** Animated stub/crossfade block — only during the slack_reply_sent scene. */
export function shouldShowSlackAgentReplyBlock(
  state: SlackRevenueDemoState
): boolean {
  return state === 'slack_reply_sent'
}

/** In-thread bubble after the reply scene (governance_logged, complete). */
export function shouldShowAgentThreadMessage(
  state: SlackRevenueDemoState
): boolean {
  return stateRank(state) > stateRank('slack_reply_sent')
}

export function buildAgentThreadMessage(content: string): SlackThreadMessage {
  return {
    id: 'msg-agent-reply',
    author: SLACK_AGENT_AUTHOR,
    content,
    timestamp: 'Just now'
  }
}

/** @deprecated Use shouldShowSlackAgentReplyBlock */
export function shouldShowAgentReply(state: SlackRevenueDemoState): boolean {
  return shouldShowSlackAgentReplyBlock(state)
}

/** @deprecated Use shouldShowSlackAgentReplyBlock */
export function shouldShowAgentReplyStub(
  state: SlackRevenueDemoState
): boolean {
  return shouldShowSlackAgentReplyBlock(state)
}

export function shouldShowReplyShimmer(phase: AgentReplyPhase): boolean {
  return phase === 'stub'
}

export function shouldShowGovernanceLoggedBadge(
  state: SlackRevenueDemoState
): boolean {
  return stateRank(state) >= stateRank('governance_logged')
}

export function resolveAgentReplyPhase(
  currentState: SlackRevenueDemoState,
  _replyStagger: ReplyStagger,
  _reduceMotion: boolean
): AgentReplyPhase {
  if (stateRank(currentState) < stateRank('slack_reply_sent')) {
    return 'hidden'
  }

  if (stateRank(currentState) > stateRank('slack_reply_sent')) {
    return 'final'
  }

  // slack_reply_sent: stub only; agent copy is shown as an in-thread bubble afterward.
  return 'stub'
}

export function getMaxVisibleMessages(
  state: SlackRevenueDemoState,
  config: SlackThreadScenarioConfig
): number {
  if (state === 'idle') return 0
  if (stateRank(state) >= stateRank('mention_detected')) {
    return config.messageCount
  }
  if (stateRank(state) >= stateRank('slack_thread_active')) {
    return config.messageCount
  }
  return 0
}

export function getMessageVisualState(
  messageIndex: number,
  visibleCount: number
): ComponentVisualState {
  if (messageIndex >= visibleCount) return 'idle'
  if (messageIndex === visibleCount - 1) return 'active'
  return 'complete'
}
