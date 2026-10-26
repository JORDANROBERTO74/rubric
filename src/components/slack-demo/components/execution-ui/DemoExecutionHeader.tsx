'use client'

import { Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DemoExecutionHeaderData } from './types'
import { DemoExecutionStatusBadge } from './DemoExecutionStatusBadge'

type DemoExecutionHeaderProps = {
  data: DemoExecutionHeaderData
}

export function DemoExecutionHeader({ data }: DemoExecutionHeaderProps) {
  return (
    <div className="mb-3 shrink-0 border-b border-border pb-3">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex max-w-full truncate rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {data.refId}
        </span>
        <span className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
          <Zap size={12} className="shrink-0 text-primary" />
          {data.target}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={12} />
          {data.durationLabel}
        </span>
        <Badge variant="outline" className="text-[10px] uppercase">
          {data.source}
        </Badge>
      </div>
      <h3 className="text-sm font-bold leading-snug text-foreground">
        <span className="italic text-muted-foreground">{data.action}</span>{' '}
        <span>{data.target}</span>
      </h3>
      {data.targetSecondary ? (
        <p className="mt-1 text-xs text-muted-foreground">{data.targetSecondary}</p>
      ) : null}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">{data.actor}</p>
        <DemoExecutionStatusBadge status={data.status} />
      </div>
    </div>
  )
}
