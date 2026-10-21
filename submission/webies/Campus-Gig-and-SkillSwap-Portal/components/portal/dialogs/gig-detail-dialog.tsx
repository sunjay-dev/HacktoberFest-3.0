'use client'

import { Check, Send, Star } from 'lucide-react'
import type { Application, Gig, User } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/portal/avatar'
import { StatusBadge } from '@/components/portal/status-badge'
import { deadlineInfo, paymentLabel } from '@/lib/format'

type GigDetailDialogProps = {
  gig: Gig | null
  me: User | null
  applications: Application[]
  applyMessage: string
  onApplyMessageChange: (value: string) => void
  myApplication: Application | undefined
  reviewed: boolean
  onClose: () => void
  onOpenProfile: (id: number) => void
  onApply: (gig: Gig) => void
  onReviewApplication: (app: Application, status: 'Accepted' | 'Rejected') => void
  onSetGigStatus: (gig: Gig, status: 'Completed' | 'Cancelled') => void
  onLeaveReview: (gig: Gig) => void
}

export function GigDetailDialog({
  gig,
  me,
  applications,
  applyMessage,
  onApplyMessageChange,
  myApplication,
  reviewed,
  onClose,
  onOpenProfile,
  onApply,
  onReviewApplication,
  onSetGigStatus,
  onLeaveReview,
}: GigDetailDialogProps) {
  const gigApplications = gig ? applications.filter((a) => a.gig_id === gig.id) : []

  return (
    <Dialog open={gig !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="gig-dialog">
        {gig && me && (
          <>
            <DialogHeader>
              <span className="type-status">
                <span className={`type-label type-${gig.type.toLowerCase()}`}>{gig.type === 'Offering' ? 'Offering help' : 'Looking for help'}</span>
                <StatusBadge status={gig.display_status} />
              </span>
              <DialogTitle className="dialog-title">{gig.title}</DialogTitle>
              <DialogDescription className="sr-only">Gig details and actions</DialogDescription>
            </DialogHeader>
            <button className="modal-person modal-person-button" onClick={() => onOpenProfile(gig.user_id)}>
              <Avatar name={gig.owner_name} id={gig.user_id} />
              <div><strong>{gig.owner_name}</strong><span>{gig.owner_major} — view profile</span></div>
            </button>
            <p className="modal-description">{gig.description}</p>
            <div className="modal-details">
              <div><span>Category</span><strong>{gig.category}</strong></div>
              <div><span>Compensation</span><strong>{paymentLabel(gig.payment_type)}{gig.budget && ` · PKR ${Number(gig.budget).toLocaleString('en-US')}`}</strong></div>
              <div><span>Deadline</span><strong>{deadlineInfo(gig.deadline).full}</strong></div>
            </div>

            {gig.user_id === me.id ? (
              <>
                <Separator className="dialog-sep" />
                <h4 className="dialog-subtitle">Applications ({gigApplications.length})</h4>
                {gigApplications.length === 0 && <p className="activity-message">No applications yet.</p>}
                {gigApplications.map((app) => (
                  <div key={app.id} className="applicant-row">
                    <div className="person">
                      <Avatar name={app.applicant_name} id={app.applicant_id} size="sm" />
                      <div>
                        <button className="link-inline strong" onClick={() => onOpenProfile(app.applicant_id)}>{app.applicant_name}</button>
                        <span>{app.applicant_major}</span>
                      </div>
                    </div>
                    {app.status === 'Pending' && gig.display_status === 'Open' ? (
                      <span className="applicant-actions">
                        <Button size="sm" onClick={() => onReviewApplication(app, 'Accepted')}><Check data-icon="inline-start" />Accept</Button>
                        <Button size="sm" variant="outline" className="btn-danger" onClick={() => onReviewApplication(app, 'Rejected')}>Reject</Button>
                      </span>
                    ) : <StatusBadge status={app.status} />}
                  </div>
                ))}
                <div className="modal-actions">
                  {gig.display_status === 'In Progress' && (
                    <Button onClick={() => onSetGigStatus(gig, 'Completed')}><Check data-icon="inline-start" />Mark completed</Button>
                  )}
                  {gig.display_status === 'Open' && (
                    <Button variant="outline" className="btn-danger" onClick={() => onSetGigStatus(gig, 'Cancelled')}>Cancel gig</Button>
                  )}
                  {gig.display_status === 'Completed' && gig.accepted_applicant_id && !reviewed && (
                    <Button onClick={() => onLeaveReview(gig)}><Star data-icon="inline-start" />Leave a review</Button>
                  )}
                  {gig.display_status === 'Completed' && reviewed && <span className="reviewed-note"><Check /> You reviewed this gig</span>}
                </div>
              </>
            ) : (
              <>
                {myApplication ? (
                  <div className="applied-note"><Check /> You applied — status: <StatusBadge status={myApplication.status} /></div>
                ) : gig.display_status !== 'Open' ? (
                  <p className="activity-message">This gig is {gig.display_status} and is not accepting applications.</p>
                ) : (
                  <div className="apply-box">
                    <Label htmlFor="apply-message">Your application message</Label>
                    <Textarea id="apply-message" value={applyMessage} onChange={(e) => onApplyMessageChange(e.target.value)} placeholder="A short note on why you are a good fit..." rows={3} />
                    <div className="modal-actions">
                      <Button onClick={() => onApply(gig)} disabled={!applyMessage.trim()}><Send data-icon="inline-start" />Apply to this gig</Button>
                      <Button variant="outline" className="btn-plain" onClick={onClose}>Maybe later</Button>
                    </div>
                  </div>
                )}
                {gig.display_status === 'Completed' && gig.accepted_applicant_id === me.id && !reviewed && (
                  <div className="modal-actions">
                    <Button variant="outline" className="btn-plain" onClick={() => onLeaveReview(gig)}><Star data-icon="inline-start" />Review {gig.owner_name.split(' ')[0]}</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
