'use client'

import { ExternalLink } from 'lucide-react'
import { RubricMark } from '@/components/brand/mark'
import type { SlackSourcePreviewCopy } from '../../types'

function truncateReply(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen).trim()}…`
}

type SlackSourcePreviewProps = {
  previewCopy: SlackSourcePreviewCopy
  agentReplyFinal: string
  onViewThread: () => void
}

export default function SlackSourcePreview({
  previewCopy,
  agentReplyFinal,
  onViewThread
}: SlackSourcePreviewProps) {
  const excerpt = truncateReply(agentReplyFinal, 88)

  return (
    <section
      className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-3 pr-4 sm:p-4 sm:pr-5"
      aria-label="Thread source preview"
    >
      <div className="flex items-center gap-2">
        <RubricMark className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        <span className="text-xs font-medium text-foreground">
          {previewCopy.channel}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground">{previewCopy.summary}</p>
      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {excerpt}
      </p>
      <button
        type="button"
        onClick={onViewThread}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        aria-label={previewCopy.linkLabel}
      >
        {previewCopy.linkLabel}
        <ExternalLink className="h-3 w-3" aria-hidden />
      </button>
    </section>
  )
}
