import { MENTION_TOKEN, SLACK_AGENT_AUTHOR } from '../../constants'

export type MentionSegment = { type: 'text' | 'mention'; value: string }

export function authorInitial(author: string): string {
  if (author === SLACK_AGENT_AUTHOR) return 'R'

  const parts = author.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase()
  }

  return (author.charAt(0) || '?').toUpperCase()
}

export function parseMentionSegments(
  content: string,
  mention: string = MENTION_TOKEN
): MentionSegment[] {
  if (!content.includes(mention)) {
    return [{ type: 'text', value: content }]
  }

  const parts = content.split(mention)
  const segments: MentionSegment[] = []

  parts.forEach((part, index) => {
    if (part) segments.push({ type: 'text', value: part })
    if (index < parts.length - 1) {
      segments.push({ type: 'mention', value: mention })
    }
  })

  return segments
}
