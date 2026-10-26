'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GRID_LAYOUT_EASE } from '../../constants'

type SceneProgressBarProps = {
  value: number
  isPlaying: boolean
  sceneIndex: number
  reduceMotion?: boolean
  className?: string
  'aria-label'?: string
}

export default function SceneProgressBar({
  value,
  isPlaying,
  sceneIndex,
  reduceMotion = false,
  className,
  'aria-label': ariaLabel = 'Scene progress'
}: SceneProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const [ariaValueNow, setAriaValueNow] = useState(() => Math.round(clamped))

  useEffect(() => {
    // aria-valuenow updates per scene, not per tick: avoids screen-reader chatter.
    setAriaValueNow(Math.round(clamped))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex])

  return (
    <motion.div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaValueNow}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: isPlaying ? 0 : 0.45,
                ease: GRID_LAYOUT_EASE
              }
        }
      />
    </motion.div>
  )
}
