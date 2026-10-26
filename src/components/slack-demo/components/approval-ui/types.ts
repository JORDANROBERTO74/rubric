export type DemoWorkflowStepStatus = 'pending' | 'current' | 'completed'

export type DemoWorkflowStep = {
  id: string
  stepNumber: number
  action: string
  status: DemoWorkflowStepStatus
}

export type DemoEscalationDecision = {
  context: string
  summary: string
  confidence: number
}

export type ScenarioApprovalUi = {
  decision: DemoEscalationDecision
  workflowSteps: DemoWorkflowStep[]
}
