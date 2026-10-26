'use client'

import type { DemoDecisionDetailField } from './types'

type DemoDecisionDetailsGridProps = {
  fields: DemoDecisionDetailField[]
  title?: string
}

export function DemoDecisionDetailsGrid({
  fields,
  title = 'Target resource data'
}: DemoDecisionDetailsGridProps) {
  if (fields.length === 0) return null

  return (
    <section
      className="min-w-0 w-full rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4"
      aria-label={title}
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        {title}
      </h3>
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {fields.map(field => (
          <div
            key={field.key}
            className="min-w-0 rounded-lg border border-border bg-muted/40 p-3"
          >
            <span className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
              {field.key}
            </span>
            <span className="break-words text-sm font-medium text-foreground">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
