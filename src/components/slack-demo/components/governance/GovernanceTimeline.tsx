'use client'

import { cn } from '@/lib/utils'
import { APPROVAL_TIMELINE_HINT, GOVERNANCE_LOGGED_LABEL } from '../../constants'
import { shouldShowApprovalTimelineHint } from '../../approvalState'
import { shouldShowSupplementalTimelineHints } from '../../completeState'
import { shouldShowGovernanceLoggedBadge } from '../../slackThreadState'
import type { SlackRevenueDemoState } from '../../types'
import {
  getActiveGovernanceEvent,
  getGovernanceEventVisualState
} from '../../zoneState'

type GovernanceTimelineProps = {
  governanceEvents: string[]
  currentState: SlackRevenueDemoState
}

export default function GovernanceTimeline({
  governanceEvents,
  currentState
}: GovernanceTimelineProps) {
  const activeEvent = getActiveGovernanceEvent(currentState)
  const showSupplemental = shouldShowSupplementalTimelineHints(currentState)

  return (
    <section
      aria-label="Governance timeline"
      className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Governance timeline
      </h3>
      <ol
        role="list"
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
      >
        {governanceEvents.map(event => {
          const visual = getGovernanceEventVisualState(event, currentState)
          const isCurrent = activeEvent === event
          const isHighlighted = isCurrent && visual === 'complete'

          return (
            <li
              key={event}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'shrink-0 rounded border px-2 py-1 font-mono text-[10px] sm:text-xs',
                visual === 'active' &&
                  'border-primary bg-primary/10 text-foreground',
                visual === 'complete' &&
                  !isHighlighted &&
                  'border-border bg-background text-muted-foreground',
                isHighlighted &&
                  'border-primary/50 bg-primary/5 text-foreground ring-1 ring-primary/25',
                visual === 'idle' &&
                  'border-transparent bg-muted/40 text-muted-foreground/50'
              )}
            >
              {event}
            </li>
          )
        })}
        {showSupplemental && shouldShowApprovalTimelineHint(currentState) && (
          <li
            role="listitem"
            className="shrink-0 rounded border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-foreground sm:text-xs"
          >
            {APPROVAL_TIMELINE_HINT}
          </li>
        )}
        {showSupplemental && shouldShowGovernanceLoggedBadge(currentState) && (
          <li
            role="listitem"
            className="shrink-0 rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-foreground sm:text-xs"
            aria-label="Reply logged to governance"
          >
            {GOVERNANCE_LOGGED_LABEL}
          </li>
        )}
      </ol>
    </section>
  )
}
