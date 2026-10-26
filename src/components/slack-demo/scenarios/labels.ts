import type { ScenarioId } from '../types'

export const SCENARIO_OPTIONS = [
  { id: 'churn' as const, label: 'Churn risk' },
  { id: 'migration' as const, label: 'Silent migration' }
] satisfies ReadonlyArray<{ id: ScenarioId; label: string }>
