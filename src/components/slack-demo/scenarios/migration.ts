import type {
  ApprovalAction,
  ScenarioBundle,
  ScenarioData,
  SourceSignal
} from '../types'
import { DEMO_GOVERNANCE_EVENTS, SLACK_LINK_LABELS } from './shared'
import {
  buildScenarioApprovalUi,
  workflowStepsToApprovalActions
} from './buildApprovalUi'
import { buildScenarioExecutionUi } from './buildExecutionUi'
import { buildScenarioRiskUi } from './buildRiskUi'

export const MIGRATION_SCENARIO_DATA: ScenarioData = {
  channel: '#customer-ops',
  background:
    'In #customer-ops, a platform engineer notes lower traffic on Acme primary services while an Account Executive reports quiet expansion outreach. No one has flagged a silent migration pattern yet. The AE mentions @rubric to check if the account is moving workloads away.',
  slackMessages: [
    {
      id: 'msg-1',
      author: 'David Kim',
      content: 'Traffic is lower on Acme primary services.',
      timestamp: '10:14 AM'
    },
    {
      id: 'msg-2',
      author: 'Emily Foster',
      content: 'They have gone quiet on expansion outreach.',
      timestamp: '10:18 AM'
    },
    {
      id: 'msg-3',
      author: 'Emily Foster',
      content: '@rubric check if this account is moving away',
      timestamp: '10:22 AM'
    }
  ],
  sourceEvidence: [
    { label: 'Infrastructure', value: 'lower load on primary services' },
    { label: 'Product usage', value: 'less platform activity' },
    { label: 'Support', value: 'questions about data export' },
    { label: 'CRM', value: 'expansion outreach unanswered' },
    { label: 'Billing', value: 'reduced footprint' }
  ],
  agentResult:
    'This account may be reducing its footprint. Suggested next step: schedule a technical architecture review and offer a migration-safe optimization plan.',
  governanceEvents: [...DEMO_GOVERNANCE_EVENTS]
}

const MIGRATION_RISK_SUMMARY = {
  account: 'Acme',
  riskFinal: 'Footprint risk',
  riskReviewing: 'Analyzing footprint',
  confidence: '82%',
  signalsSummary: 'Load down · Export questions · Quiet outreach'
} as const

const MIGRATION_APPROVAL_ACTIONS: ApprovalAction[] = [
  { id: 'architecture', label: 'Architecture review scheduled' },
  { id: 'optimization', label: 'Migration-safe optimization prepared' },
  { id: 'ae', label: 'Account Executive outreach coordinated' }
]

function buildMigrationSourceSignals(data: ScenarioData): SourceSignal[] {
  return [
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      evidenceLine: 'lower load on primary services',
      detail: data.sourceEvidence[0].value,
      icon: 'infrastructure'
    },
    {
      id: 'usage-trend',
      label: 'Product usage',
      evidenceLine: 'less platform activity',
      detail: data.sourceEvidence[1].value,
      icon: 'trendingDown'
    },
    {
      id: 'support-tickets',
      label: 'Support',
      evidenceLine: 'questions about data export',
      detail: data.sourceEvidence[2].value,
      icon: 'ticket'
    },
    {
      id: 'crm',
      label: 'CRM',
      evidenceLine: 'expansion outreach unanswered',
      detail: data.sourceEvidence[3].value,
      icon: 'calendar'
    },
    {
      id: 'billing',
      label: 'Billing',
      evidenceLine: 'reduced footprint',
      detail: data.sourceEvidence[4].value,
      icon: 'creditCard'
    }
  ]
}

export function buildMigrationBundle(): ScenarioBundle {
  const data = MIGRATION_SCENARIO_DATA
  const channelInstructions = {
    channel: data.channel,
    summary: 'Retention agent context: customer-ops migration playbook'
  }
  const riskUi = buildScenarioRiskUi(data, MIGRATION_RISK_SUMMARY, {
    conceptKey: 'customer.footprint_risk',
    namespace: 'integrations.infrastructure',
    sourceTypeKey: 'workload',
    groundingStatus: 'requires_approval',
    extraWarnings: ['Data export questions detected in support channel']
  })
  const approvalUi = buildScenarioApprovalUi(
    MIGRATION_RISK_SUMMARY,
    MIGRATION_APPROVAL_ACTIONS,
    { context: 'Human gate' }
  )

  return {
    id: 'migration',
    data,
    channelInstructions,
    executionUi: buildScenarioExecutionUi(data, {
      refId: 'exec_slack_acme_migration',
      stepLogPaths: [
        {
          method: 'GET',
          path: '/integrations/infrastructure/load',
          summary: 'Query infrastructure load'
        },
        {
          method: 'GET',
          path: '/integrations/product/usage',
          summary: 'Query product usage'
        },
        {
          method: 'GET',
          path: '/integrations/support/exports',
          summary: 'Query support export requests'
        },
        {
          method: 'GET',
          path: '/integrations/crm/outreach',
          summary: 'Query CRM outreach'
        },
        {
          method: 'GET',
          path: '/integrations/billing/footprint',
          summary: 'Query billing footprint'
        }
      ]
    }),
    sourceSignals: buildMigrationSourceSignals(data),
    riskSummary: { ...MIGRATION_RISK_SUMMARY },
    riskUi,
    approvalActions: workflowStepsToApprovalActions(approvalUi.workflowSteps),
    approvalUi,
    slackSourcePreview: {
      channel: data.channel,
      summary: 'Agent reply posted · footprint pattern surfaced',
      ...SLACK_LINK_LABELS
    },
    slackComposerPlaceholder: `Message ${data.channel}`,
    preMentionMessageCount: 2
  }
}
