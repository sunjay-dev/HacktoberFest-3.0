'use client'

import { Star } from 'lucide-react'
import type { Gig, User } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ReviewDialogProps = {
  gig: Gig | null
  me: User | null
  users: User[]
  rating: number
  onRatingChange: (rating: number) => void
  comment: string
  onCommentChange: (comment: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function ReviewDialog({
  gig,
  me,
  users,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onClose,
  onSubmit,
}: ReviewDialogProps) {
  const reviewee = gig && me
    ? users.find((u) => u.id === (gig.user_id === me.id ? gig.accepted_applicant_id : gig.user_id))
    : undefined

  return (
    <Dialog open={gig !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="gig-dialog">
        {gig && me && (
          <>
            <DialogHeader>
              <DialogTitle className="dialog-title">Review this gig</DialogTitle>
              <DialogDescription className="modal-description">
                {gig.title} — your rating goes to {reviewee?.name} and counts toward their profile average.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div>
                <Label>Your rating</Label>
                <div className="star-input">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" onClick={() => onRatingChange(i)} aria-label={`${i} stars`}>
                      <Star className={i <= rating ? 'star-on' : 'star-off'} />
                    </button>
                  ))}
                  <span>{rating}/5</span>
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment">Comment</Label>
                <Textarea id="review-comment" value={comment} onChange={(e) => onCommentChange(e.target.value)} placeholder="How did it go? Were they reliable, skilled, on time..." rows={3} />
              </div>
            </div>
            <div className="modal-actions">
              <Button onClick={onSubmit}><Star data-icon="inline-start" />Submit review</Button>
              <Button variant="outline" className="btn-plain" onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
