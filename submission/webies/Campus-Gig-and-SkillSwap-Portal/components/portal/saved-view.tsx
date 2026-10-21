'use client'

import { Heart, Plus } from 'lucide-react'
import type { Gig } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { GigCard } from '@/components/portal/gig-card'
import { GigGridSkeleton } from '@/components/portal/skeletons'

type SavedViewProps = {
  gigs: Gig[]
  loading: boolean
  savedIds: number[]
  onToggleSave: (id: number) => void
  onOpenGig: (id: number) => void
  onPost: () => void
}

export function SavedView({ gigs, loading, savedIds, onToggleSave, onOpenGig, onPost }: SavedViewProps) {
  return (
    <>
      <div className="section-heading view-heading">
        <div><h2>Saved gigs</h2><p>Gigs you bookmarked with the heart. Only you can see this list.</p></div>
        <Button className="post-button" onClick={onPost}><Plus data-icon="inline-start" />Post a gig</Button>
      </div>
      {loading ? (
        <GigGridSkeleton count={3} />
      ) : gigs.length === 0 ? (
        <div className="empty-state"><Heart /><h3>No saved gigs yet</h3><p>Tap the heart on any gig and it will be kept here.</p></div>
      ) : (
        <div className="gig-grid">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} saved={savedIds.includes(gig.id)} onToggleSave={onToggleSave} onOpen={onOpenGig} />
          ))}
        </div>
      )}
    </>
  )
}
