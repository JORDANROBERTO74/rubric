'use client'

import { Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const COMPOSER_ARIA_LABEL = 'Message input (demo preview, read-only)'

type SlackThreadComposerProps = {
  placeholder: string
  className?: string
}

export default function SlackThreadComposer({
  placeholder,
  className
}: SlackThreadComposerProps) {
  return (
    <div
      className={cn(
        'shrink-0 border-t border-border bg-background px-2 py-2 sm:px-2.5',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
          aria-hidden
          onClick={e => e.preventDefault()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          readOnly
          placeholder={placeholder}
          aria-label={COMPOSER_ARIA_LABEL}
          className={cn(
            'h-8 flex-1 cursor-text bg-background text-xs text-foreground',
            'placeholder:text-muted-foreground',
            'read-only:cursor-text read-only:opacity-100'
          )}
          onKeyDown={e => e.preventDefault()}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-primary hover:text-primary"
          tabIndex={-1}
          aria-hidden
          onClick={e => e.preventDefault()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
