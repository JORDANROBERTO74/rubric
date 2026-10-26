import type { DemoBusinessGroundingData, DemoGroundingBadgeTone } from './types'

export function resolveGroundingStatusTone(
  status: string
): DemoGroundingBadgeTone {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'grounded') return 'good'
  if (
    normalized === 'requires_approval' ||
    normalized === 'grounded_with_warnings'
  ) {
    return 'warn'
  }
  if (normalized === 'ungrounded') return 'danger'
  return 'muted'
}

export function resolveGroundingStrengthTone(
  strength: string
): DemoGroundingBadgeTone {
  return strength.trim().toLowerCase() === 'strong' ? 'good' : 'warn'
}

export function formatGroundingStatusLabel(status: string): string {
  return status.replace(/_/g, ' ')
}

export function formatGroundingStrengthLabel(strength: string): string {
  return `${strength} grounding`
}

export function getPayloadReviewLabel(data: DemoBusinessGroundingData): string {
  return data.rawPayloadStored ? 'payload review' : 'payload not stored'
}

export function getPayloadReviewTone(
  data: DemoBusinessGroundingData
): DemoGroundingBadgeTone {
  return data.rawPayloadStored ? 'danger' : 'good'
}
