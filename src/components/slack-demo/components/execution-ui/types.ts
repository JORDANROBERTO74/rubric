export type DemoExecutionStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'running'
  | 'info'

export type DemoExecutionHeaderData = {
  refId: string
  actor: string
  action: string
  target: string
  targetSecondary?: string
  durationLabel: string
  source: string
  status: DemoExecutionStatus
}

export type DemoStepLogStatus = 'success' | 'error' | 'running'

export type DemoStepLogDetail = {
  id: string
  label: string
  value: string
}

export type DemoStepLog = {
  id: string
  stepNumber: number
  status: DemoStepLogStatus
  statusLabel: string
  methodLabel: string
  pathLabel: string
  durationLabel: string
  summary: string
  detailSections?: DemoStepLogDetail[]
}

export type ScenarioExecutionUi = {
  header: DemoExecutionHeaderData
  stepLogs: DemoStepLog[]
}
