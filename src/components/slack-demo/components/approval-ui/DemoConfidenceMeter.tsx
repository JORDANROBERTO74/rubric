'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { DEMO_EASE } from './motionConstants'

type DemoConfidenceMeterProps = {
  value: number
  className?: string
  animateIn?: boolean
}

export function DemoConfidenceMeter({
  value,
  className,
  animateIn = true
}: DemoConfidenceMeterProps) {
  const reduceMotion = useReducedMotion()
  const clamped = Math.min(1, Math.max(0, value))
  let color = 'bg-red-500'
  if (clamped >= 0.8) color = 'bg-emerald-500'
  else if (clamped >= 0.6) color = 'bg-amber-500'

  const shouldAnimate = animateIn && !reduceMotion

  return (
    <motion.div
      className={className}
      title={`Confidence: ${Math.round(clamped * 100)}%`}
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: DEMO_EASE }}
    >
      <motion.div className="flex min-w-0 items-center gap-2">
        <div className="h-1.5 w-20 min-w-0 flex-1 overflow-hidden rounded-full bg-muted sm:w-24">
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={shouldAnimate ? { width: 0 } : false}
            animate={{ width: `${clamped * 100}%` }}
            transition={{
              duration: 0.75,
              ease: DEMO_EASE,
              delay: shouldAnimate ? 0.12 : 0
            }}
          />
        </div>
        <motion.span
          className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground"
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.35 : 0 }}
        >
          {Math.round(clamped * 100)}%
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
