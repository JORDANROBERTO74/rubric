'use client'

import { AlertTriangle, ShieldCheck } from 'lucide-react'
import type { DemoBusinessGroundingData } from './types'
import { DemoGroundingBadge } from './DemoGroundingBadge'
import {
  formatGroundingStatusLabel,
  formatGroundingStrengthLabel,
  getPayloadReviewLabel,
  getPayloadReviewTone,
  resolveGroundingStatusTone,
  resolveGroundingStrengthTone
} from './groundingTone'

type DemoBusinessGroundingCardProps = {
  data: DemoBusinessGroundingData
}

export function DemoBusinessGroundingCard({ data }: DemoBusinessGroundingCardProps) {
  const statusTone = resolveGroundingStatusTone(data.groundingStatus)
  const strengthTone = resolveGroundingStrengthTone(data.groundingStrength)

  return (
    <div className="min-w-0 w-full rounded-md border border-border bg-background p-3">
      <p className="mb-2 text-xs text-muted-foreground">Account</p>
      <p className="mb-3 truncate text-lg font-semibold text-foreground">
        {data.account}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <span className="text-[11px] font-semibold text-foreground">
          Business grounding
        </span>
        {data.conceptKey ? (
          <DemoGroundingBadge label={data.conceptKey} />
        ) : null}
        {data.groundingStatus ? (
          <DemoGroundingBadge
            label={formatGroundingStatusLabel(data.groundingStatus)}
            tone={statusTone}
          />
        ) : null}
        {data.groundingStrength ? (
          <DemoGroundingBadge
            label={formatGroundingStrengthLabel(data.groundingStrength)}
            tone={strengthTone}
          />
        ) : null}
        <DemoGroundingBadge
          label={getPayloadReviewLabel(data)}
          tone={getPayloadReviewTone(data)}
        />
      </div>
      <div className="mt-2 grid min-w-0 gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
        <div className="min-w-0 truncate">
          <span className="text-muted-foreground/70">Source: </span>
          {data.namespace}.{data.sourceTypeKey}
        </div>
        <div className="min-w-0 truncate">
          <span className="text-muted-foreground/70">Mode: </span>
          {data.readWriteMode}
          <span className="px-1 text-muted-foreground/50">/</span>
          {data.riskLevel}
        </div>
      </div>
      {(data.warnings.length > 0 || data.blockers.length > 0) && (
        <div className="mt-2 space-y-1">
          {data.warnings.map(item => (
            <div
              key={`warn-${item}`}
              className="flex min-w-0 gap-1.5 text-[11px] text-amber-700"
            >
              <AlertTriangle
                className="mt-0.5 h-3 w-3 shrink-0"
                aria-hidden
              />
              <span className="break-words">{item}</span>
            </div>
          ))}
          {data.blockers.map(item => (
            <div
              key={`block-${item}`}
              className="flex min-w-0 gap-1.5 text-[11px] text-amber-700"
            >
              <AlertTriangle
                className="mt-0.5 h-3 w-3 shrink-0"
                aria-hidden
              />
              <span className="break-words">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
