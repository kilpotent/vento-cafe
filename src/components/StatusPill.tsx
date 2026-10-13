import { useLiveStatus } from '../hooks/useLiveStatus.ts'
import { useLanguage } from '../i18n/context.ts'
import { describeCafe } from '../lib/status.ts'
import './StatusPill.css'

/** "Open now · closes at midnight", kept current in the café's time zone. */
export default function StatusPill({ className = '' }: { className?: string }) {
  const { t } = useLanguage()
  const { cafe } = useLiveStatus()
  const status = describeCafe(t, cafe)
  return (
    <p className={`status-pill ${status.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="dot" aria-hidden="true" />
      <span className="status-pill__text">
        <strong>{status.label}</strong>
        {/* The no-break space keeps the separator with the label if the line wraps. */}
        {status.detail && ` · ${status.detail}`}
      </span>
    </p>
  )
}
