import { useState } from 'react'
import { useAdminSession } from '../admin/AdminSessionContext'
import './BuilderMarker.css'

type BuilderMarkerProps = {
  blockId: string
  label?: string
}

function BuilderMarker({ blockId, label }: BuilderMarkerProps) {
  const { isBuilderSession } = useAdminSession()
  const [copied, setCopied] = useState(false)
  if (!isBuilderSession) return null

  const copyBlockId = async () => {
    try {
      await navigator.clipboard.writeText(blockId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <span className="builder-marker" title={blockId}>
      <span>{label || blockId}</span>
      <button type="button" className="builder-marker-copy" onClick={copyBlockId}>
        {copied ? 'Copied' : 'Copy ID'}
      </button>
    </span>
  )
}

export default BuilderMarker
