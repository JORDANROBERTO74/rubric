import type { ScenarioData } from '../types'
import type { ScenarioExecutionUi } from '../components/execution-ui/types'

function buildStepLogs(
  data: ScenarioData,
  paths: { method: string; path: string; summary: string }[]
) {
  return data.sourceEvidence.map((item, index) => {
    const path = paths[index] ?? {
      method: 'GET',
      path: `/sources/${item.label.toLowerCase().replace(/\s+/g, '-')}`,
      summary: `Query ${item.label}`
    }
    return {
      id: `step-${index + 1}`,
      stepNumber: index + 1,
      status: 'success' as const,
      statusLabel: 'Success',
      methodLabel: path.method,
      pathLabel: path.path,
      durationLabel: `${180 + index * 90}ms`,
      summary: path.summary,
      detailSections: [{ id: 'result', label: 'Result', value: item.value }]
    }
  })
}

export function buildScenarioExecutionUi(
  data: ScenarioData,
  options: {
    refId: string
    stepLogPaths: { method: string; path: string; summary: string }[]
  }
): ScenarioExecutionUi {
  return {
    header: {
      refId: options.refId,
      actor: 'Retention Agent',
      action: 'Thread mention',
      target: data.channel,
      targetSecondary: 'Acme · governed thread',
      durationLabel: '2.4s',
      source: 'agent',
      status: 'running'
    },
    stepLogs: buildStepLogs(data, options.stepLogPaths)
  }
}
