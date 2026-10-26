export type DemoGroundingBadgeTone = 'good' | 'warn' | 'danger' | 'muted'

export type DemoBusinessGroundingData = {
  account: string
  conceptKey: string
  groundingStatus: string
  groundingStrength: string
  riskLevel: string
  namespace: string
  sourceTypeKey: string
  readWriteMode: string
  rawPayloadStored: boolean
  warnings: string[]
  blockers: string[]
}

export type DemoDecisionDetailField = {
  key: string
  value: string
}

export type ScenarioRiskUi = {
  grounding: DemoBusinessGroundingData
  details: DemoDecisionDetailField[]
  signalsSummary: string
}
