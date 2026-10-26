'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DemoGroundingBadgeTone } from './types'

type DemoGroundingBadgeProps = {
  label: string
  tone?: DemoGroundingBadgeTone
}

export function DemoGroundingBadge({
  label,
  tone = 'muted'
}: DemoGroundingBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'px-1.5 py-0 text-[10px]',
        tone === 'good' &&
          'border-emerald-300 bg-emerald-50 text-emerald-700',
        tone === 'warn' &&
          'border-amber-300 bg-amber-50 text-amber-700',
        tone === 'danger' && 'border-red-300 bg-red-50 text-red-700',
        tone === 'muted' &&
          'border-border bg-background text-muted-foreground'
      )}
    >
      {label}
    </Badge>
  )
}
