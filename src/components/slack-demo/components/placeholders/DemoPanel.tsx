import type { Ref } from 'react'
import { cn } from '@/lib/utils'
import { DEMO_ZONE_PANEL_HEIGHT_CLASS } from '../../constants'
import type { ComponentVisualState } from '../../types'
import { panelClassForVisualState } from '../../zoneState'

type DemoPanelScrollMode = 'body' | 'inner'

type DemoPanelProps = {
  title: string
  visualState: ComponentVisualState
  ariaLabel: string
  className?: string
  /** body: panel body scrolls; inner: body is flex shell (child handles scroll, e.g. Slack thread). */
  scrollMode?: DemoPanelScrollMode
  bodyScrollRef?: Ref<HTMLDivElement>
  onBodyScroll?: () => void
  /** Shown on the same row as the panel title (e.g. Back to summary). */
  headerTrailing?: React.ReactNode
  children: React.ReactNode
}

export default function DemoPanel({
  title,
  visualState,
  ariaLabel,
  className,
  scrollMode = 'body',
  bodyScrollRef,
  onBodyScroll,
  headerTrailing,
  children
}: DemoPanelProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'flex flex-col rounded-lg border p-3 transition-[border-color,opacity,box-shadow] duration-300 sm:p-4',
        DEMO_ZONE_PANEL_HEIGHT_CLASS,
        panelClassForVisualState(visualState),
        className
      )}
    >
      <div className="mb-3 flex min-w-0 shrink-0 items-center justify-between gap-2 h-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {headerTrailing ? (
          <div className="shrink-0">{headerTrailing}</div>
        ) : null}
      </div>
      <div
        ref={scrollMode === 'body' ? bodyScrollRef : undefined}
        onScroll={scrollMode === 'body' ? onBodyScroll : undefined}
        className={cn(
          'min-h-0 min-w-0 w-full flex-1',
          scrollMode === 'body' &&
            'overflow-y-auto overscroll-contain pe-1 pr-2.5 sm:pr-3 [scrollbar-gutter:stable]',
          scrollMode === 'inner' && 'flex flex-col overflow-hidden'
        )}
      >
        {children}
      </div>
    </section>
  )
}
