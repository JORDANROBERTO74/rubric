'use client'

import { ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SCENARIO_OPTIONS } from '../../scenarios'
import type { ScenarioId } from '../../types'
import SceneProgressBar from './SceneProgressBar'

type ReplayControlsBarProps = {
  isPlaying: boolean
  progress: number
  sceneIndex: number
  scenario: ScenarioId
  onTogglePlayPause: () => void
  onReplay: () => void
  onStepForward: () => void
  onScenarioChange: (id: ScenarioId) => void
  reduceMotionEnabled: boolean
  onReduceMotionChange: (enabled: boolean) => void
  effectiveReduceMotion?: boolean
}

export default function ReplayControlsBar({
  isPlaying,
  progress,
  sceneIndex,
  scenario,
  onTogglePlayPause,
  onReplay,
  onStepForward,
  onScenarioChange,
  reduceMotionEnabled,
  onReduceMotionChange,
  effectiveReduceMotion = false
}: ReplayControlsBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onTogglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="gap-2"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReplay}
          aria-label="Replay"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Replay
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onStepForward}
          aria-label="Step forward"
          className="gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          Step
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            id="reduce-motion-toggle"
            checked={reduceMotionEnabled}
            onCheckedChange={onReduceMotionChange}
            aria-label="Reduce motion"
          />
          <Label
            htmlFor="reduce-motion-toggle"
            className="cursor-pointer text-xs font-normal text-muted-foreground"
          >
            Reduce motion
          </Label>
        </div>
        <ToggleGroup
          type="single"
          value={scenario}
          onValueChange={value => {
            if (!value) return
            onScenarioChange(value as ScenarioId)
          }}
          variant="outline"
          size="sm"
          spacing={0}
          className="ml-auto rounded-md border border-border/80 bg-muted/30 p-0.5"
          aria-label="Scenario"
        >
          {SCENARIO_OPTIONS.map(option => (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              aria-label={`${option.label} scenario`}
              className="px-2.5 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <SceneProgressBar
        value={progress}
        isPlaying={isPlaying}
        sceneIndex={sceneIndex}
        reduceMotion={effectiveReduceMotion}
        aria-label="Scene progress"
      />
    </div>
  )
}
