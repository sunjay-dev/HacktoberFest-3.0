'use client'

import { Clock3, Heart } from 'lucide-react'
import type { Gig } from '@/lib/api'
import { deadlineInfo, paymentText } from '@/lib/format'
import { Avatar } from '@/components/portal/avatar'
import { StatusBadge } from '@/components/portal/status-badge'

type GigCardProps = {
  gig: Gig
  saved: boolean
  onToggleSave: (id: number) => void
  onOpen: (id: number) => void
}

export function GigCard({ gig, saved, onToggleSave, onOpen }: GigCardProps) {
  return (
    <article className="gig-card" onClick={() => onOpen(gig.id)}>
      <div className="gig-card-top">
        <span className="type-status">
          <span className={`type-label type-${gig.type.toLowerCase()}`}>{gig.type === 'Offering' ? 'Offering help' : 'Looking for help'}</span>
          {gig.display_status !== 'Open' && <StatusBadge status={gig.display_status} />}
        </span>
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          aria-label="Save gig"
          onClick={(e) => { e.stopPropagation(); onToggleSave(gig.id) }}
        >
          <Heart />
        </button>
      </div>
      <h3>{gig.title}</h3>
      <p className="gig-description">{gig.description}</p>
      <p className="gig-meta-line">
        {gig.category} · {paymentText(gig)}
        {(gig.applications_count ?? 0) > 0 ? ` · ${gig.applications_count} applicant${gig.applications_count === 1 ? '' : 's'}` : ''}
      </p>
      <div className="gig-card-footer">
        <div className="person">
          <Avatar name={gig.owner_name} id={gig.user_id} size="sm" />
          <div><strong>{gig.owner_name}</strong><span>{gig.owner_major}</span></div>
        </div>
        <span className="deadline"><Clock3 />{deadlineInfo(gig.deadline).label}</span>
      </div>
    </article>
  )
}
