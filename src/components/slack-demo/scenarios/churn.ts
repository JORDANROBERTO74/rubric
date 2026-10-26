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

export const CHURN_SCENARIO_DATA: ScenarioData = {
  channel: '#enterprise-support',
  background:
    'A Customer Success Manager sees a thread in #enterprise-support where the support team discusses repeated complaints from Acme: slow response times, billing confusion, and delayed ticket updates. No one has marked the account at risk yet. The CSM mentions @rubric to check churn risk before the client escalates.',
  slackMessages: [
    {
      id: 'msg-1',
      author: 'James Okonkwo',
      content: 'Acme reports slow response times again.',
      timestamp: '10:12 AM'
    },
    {
      id: 'msg-2',
      author: 'Priya Patel',
      content: 'They are confused about usage charges.',
      timestamp: '10:15 AM'
    },
    {
      id: 'msg-3',
      author: 'Alex Rivera',
      content: 'Ticket updates are delayed.',
      timestamp: '10:18 AM'
    },
    {
      id: 'msg-4',
      author: 'Sarah Mitchell',
      content: '@rubric check churn risk for Acme.',
      timestamp: '10:22 AM'
    }
  ],
  sourceEvidence: [
    { label: 'Support tickets', value: '+38% in 14 days' },
    { label: 'Usage trend', value: '-17% active workload' },
    { label: 'Billing', value: '2 unresolved invoice questions' },
    { label: 'CRM', value: 'renewal in 45 days' },
    { label: 'Workflow history', value: 'latency workflow reopened' }
  ],
  agentResult:
    'Acme is showing churn risk. Support volume is up, usage is down, and renewal is 45 days away.',
  governanceEvents: [...DEMO_GOVERNANCE_EVENTS]
}

const CHURN_RISK_SUMMARY = {
  account: 'Acme',
  riskFinal: 'High',
  riskReviewing: 'Reviewing',
  confidence: '82%',
  signalsSummary: 'Support up · Usage down · Renewal in 45 days'
} as const

const CHURN_APPROVAL_ACTIONS: ApprovalAction[] = [
  { id: 'engineering', label: 'Engineering owner assigned' },
  { id: 'ae', label: 'Account Executive notified' },
  { id: 'update', label: 'Customer-safe update prepared' }
]

function buildChurnSourceSignals(data: ScenarioData): SourceSignal[] {
  return [
    {
      id: 'support-tickets',
      label: 'Support tickets',
      evidenceLine: '+38% support volume',
      detail: data.sourceEvidence[0].value,
      icon: 'ticket'
    },
    {
      id: 'usage-trend',
      label: 'Usage trend',
      evidenceLine: '-17% platform activity',
      detail: data.sourceEvidence[1].value,
      icon: 'trendingDown'
    },
    {
      id: 'billing',
      label: 'Billing history',
      evidenceLine: 'open billing confusion',
      detail: data.sourceEvidence[2].value,
      icon: 'creditCard'
    },
    {
      id: 'crm',
      label: 'CRM renewal',
      evidenceLine: 'renewal in 45 days',
      detail: data.sourceEvidence[3].value,
      icon: 'calendar'
    },
    {
      id: 'workflow',
      label: 'Workflow history',
      evidenceLine: 'prior latency workflow',
      detail: data.sourceEvidence[4].value,
      icon: 'history'
    }
  ]
}

export function buildChurnBundle(): ScenarioBundle {
  const data = CHURN_SCENARIO_DATA
  const channelInstructions = {
    channel: data.channel,
    summary: 'Retention agent context: enterprise support escalation playbook'
  }
  const riskUi = buildScenarioRiskUi(data, CHURN_RISK_SUMMARY, {
    conceptKey: 'customer.churn_risk',
    namespace: 'integrations',
    sourceTypeKey: 'thread',
    extraWarnings: ['Support volume elevated vs. prior period']
  })
  const approvalUi = buildScenarioApprovalUi(
    CHURN_RISK_SUMMARY,
    CHURN_APPROVAL_ACTIONS,
    { context: 'Escalation required' }
  )

  return {
    id: 'churn',
    data,
    channelInstructions,
    executionUi: buildScenarioExecutionUi(data, {
      refId: 'exec_slack_acme_churn',
      stepLogPaths: [
        {
          method: 'GET',
          path: '/integrations/support/tickets',
          summary: 'Query support tickets'
        },
        {
          method: 'GET',
          path: '/integrations/usage/trend',
          summary: 'Query usage trend'
        },
        {
          method: 'GET',
          path: '/integrations/billing/invoices',
          summary: 'Query billing history'
        },
        {
          method: 'GET',
          path: '/integrations/crm/renewal',
          summary: 'Query CRM renewal'
        },
        {
          method: 'GET',
          path: '/integrations/workflows/history',
          summary: 'Query workflow history'
        }
      ]
    }),
    sourceSignals: buildChurnSourceSignals(data),
    riskSummary: { ...CHURN_RISK_SUMMARY },
    riskUi,
    approvalActions: workflowStepsToApprovalActions(approvalUi.workflowSteps),
    approvalUi,
    slackSourcePreview: {
      channel: data.channel,
      summary: 'Agent reply posted · churn risk surfaced',
      ...SLACK_LINK_LABELS
    },
    slackComposerPlaceholder: `Message ${data.channel}`,
    preMentionMessageCount: 3
  }
}
