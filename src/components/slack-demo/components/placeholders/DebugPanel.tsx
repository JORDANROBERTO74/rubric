'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { SCENE_LABELS, SCENE_SEQUENCE } from '../../constants'
import { getDemoGridLayoutMode } from '../../completeState'
import type {
  ComponentVisualState,
  ScenarioId,
  SlackRevenueDemoState
} from '../../types'

type DebugPanelProps = {
  currentState: SlackRevenueDemoState
  sceneIndex: number
  scenario?: ScenarioId
  defaultOpen?: boolean
  previewErrorStates?: boolean
  onPreviewErrorStatesChange?: (enabled: boolean) => void
}

function chipVisualState(
  index: number,
  sceneIndex: number
): ComponentVisualState {
  if (index < sceneIndex) return 'complete'
  if (index === sceneIndex) return 'active'
  return 'idle'
}

const CHIP_STYLES: Record<ComponentVisualState, string> = {
  idle: 'border-border bg-muted/40 text-muted-foreground',
  active: 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/30',
  complete: 'border-border bg-muted text-foreground/80',
  error: 'border-destructive/50 bg-destructive/10 text-destructive'
}

export default function DebugPanel({
  currentState,
  sceneIndex,
  scenario,
  defaultOpen = false,
  previewErrorStates = false,
  onPreviewErrorStatesChange
}: DebugPanelProps) {
  const gridMode = getDemoGridLayoutMode(currentState)

  return (
    <details
      className="rounded-lg border border-border bg-muted/10"
      open={defaultOpen}
    >
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        Debug — scene state
        {scenario != null ? (
          <Badge variant="outline" className="ml-2 font-mono text-[10px]">
            Scenario: {scenario}
          </Badge>
        ) : null}
      </summary>
      <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
        {onPreviewErrorStatesChange ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id="preview-error-states"
              checked={previewErrorStates}
              onCheckedChange={checked =>
                onPreviewErrorStatesChange(checked === true)
              }
            />
            <Label
              htmlFor="preview-error-states"
              className="cursor-pointer text-xs font-normal text-muted-foreground"
            >
              Preview error states
            </Label>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="font-mono text-xs">{currentState}</Badge>
          <span className="text-sm text-muted-foreground">
            Scene {sceneIndex + 1} / {SCENE_SEQUENCE.length}
            <span className="mx-2 text-border">·</span>
            {SCENE_LABELS[currentState]}
            <span className="mx-2 text-border">·</span>
            Grid: {gridMode}
          </span>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Scene sequence debug"
        >
          {SCENE_SEQUENCE.map((step, index) => {
            const visual = chipVisualState(index, sceneIndex)
            return (
              <span
                key={step.state}
                role="listitem"
                className={cn(
                  'rounded-md border px-2 py-1 text-[10px] font-medium',
                  CHIP_STYLES[visual]
                )}
              >
                {step.state}
              </span>
            )
          })}
        </div>
      </div>
    </details>
  )
}
