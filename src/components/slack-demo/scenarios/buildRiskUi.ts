import type { ScenarioRiskUi } from '../components/risk-ui/types'
import type { RiskSummaryCopy, ScenarioData } from '../types'

type BuildRiskUiOptions = {
  conceptKey: string
  namespace: string
  sourceTypeKey: string
  groundingStatus?: string
  groundingStrength?: string
  extraWarnings?: string[]
  extraBlockers?: string[]
}

export function buildScenarioRiskUi(
  data: ScenarioData,
  riskSummary: RiskSummaryCopy,
  options: BuildRiskUiOptions
): ScenarioRiskUi {
  const warnings = [...(options.extraWarnings ?? [])].filter(Boolean)

  return {
    grounding: {
      account: riskSummary.account,
      conceptKey: options.conceptKey,
      groundingStatus: options.groundingStatus ?? 'grounded_with_warnings',
      groundingStrength: options.groundingStrength ?? 'weak',
      riskLevel: riskSummary.riskFinal,
      namespace: options.namespace,
      sourceTypeKey: options.sourceTypeKey,
      readWriteMode: 'read',
      rawPayloadStored: false,
      warnings,
      blockers: options.extraBlockers ?? [
        'Elevated-risk operation requires human approval before customer outreach.'
      ]
    },
    details: data.sourceEvidence.map(item => ({
      key: item.label,
      value: item.value
    })),
    signalsSummary: riskSummary.signalsSummary
  }
}
