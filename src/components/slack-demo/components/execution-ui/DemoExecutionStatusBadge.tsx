import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle
} from 'lucide-react'
import type { DemoExecutionStatus } from './types'

export function DemoExecutionStatusBadge({
  status
}: {
  status: DemoExecutionStatus
}) {
  const styles: Record<DemoExecutionStatus, string> = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    running: 'bg-primary/10 text-primary border-primary/20',
    info: 'bg-primary/10 text-primary border-primary/20'
  }

  const icons: Record<DemoExecutionStatus, typeof Activity> = {
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
    running: Loader2,
    info: Activity
  }

  const Icon = icons[status]
  const isSpinning = status === 'running'

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <Icon size={12} className={isSpinning ? 'animate-spin' : ''} />
      <span className="capitalize">{status.replace('_', ' ')}</span>
    </span>
  )
}
