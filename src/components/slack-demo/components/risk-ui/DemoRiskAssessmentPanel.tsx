'use client'

import { motion } from 'framer-motion'
import { isRiskSectionVisible } from '../../riskState'
import type { ScenarioRiskUi } from './types'
import { DemoBusinessGroundingCard } from './DemoBusinessGroundingCard'
import { DemoDecisionDetailsGrid } from './DemoDecisionDetailsGrid'

const ENTRY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type DemoRiskAssessmentPanelProps = {
  riskUi: ScenarioRiskUi
  buildStep: number
  reduceMotion: boolean
}

function SectionReveal({
  visible,
  reduceMotion,
  children
}: {
  visible: boolean
  reduceMotion: boolean
  children: React.ReactNode
}) {
  if (!visible) return null

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: ENTRY_EASE }}
      className="min-w-0 w-full"
    >
      {children}
    </motion.div>
  )
}

export function DemoRiskAssessmentPanel({
  riskUi,
  buildStep,
  reduceMotion
}: DemoRiskAssessmentPanelProps) {
  return (
    <div
      className="min-w-0 w-full max-w-full space-y-3"
      aria-live="polite"
      aria-label="Risk assessment"
    >
      <SectionReveal
        visible={isRiskSectionVisible('grounding', buildStep)}
        reduceMotion={reduceMotion}
      >
        <DemoBusinessGroundingCard data={riskUi.grounding} />
      </SectionReveal>

      <SectionReveal
        visible={isRiskSectionVisible('details', buildStep)}
        reduceMotion={reduceMotion}
      >
        <DemoDecisionDetailsGrid fields={riskUi.details} />
      </SectionReveal>

      <SectionReveal
        visible={isRiskSectionVisible('summary', buildStep)}
        reduceMotion={reduceMotion}
      >
        <p className="break-words text-xs text-muted-foreground">
          {riskUi.signalsSummary}
        </p>
      </SectionReveal>
    </div>
  )
}
