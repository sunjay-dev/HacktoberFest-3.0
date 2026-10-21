'use client'

import { BriefcaseBusiness, Check, Plus, Send, Star } from 'lucide-react'
import type { Application, Gig, Review, User } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/portal/avatar'
import { StatusBadge } from '@/components/portal/status-badge'
import { Stars } from '@/components/portal/stars'
import { deadlineInfo, paymentLabel } from '@/lib/format'

type ActivityViewProps = {
  me: User
  tab: string
  onTabChange: (value: string) => void
  myApplications: Application[]
  myGigs: Gig[]
  users: User[]
  reviews: Review[]
  reviewableGigs: Gig[]
  appsForGig: (gigId: number) => Application[]
  myReviewFor: (gigId: number) => Review | undefined
  onOpenGig: (id: number) => void
  onOpenProfile: (id: number) => void
  onPost: () => void
  onReviewApplication: (app: Application, status: 'Accepted' | 'Rejected') => void
  onSetGigStatus: (gig: Gig, status: 'Completed' | 'Cancelled') => void
  onLeaveReview: (gig: Gig) => void
}

export function ActivityView({
  me,
  tab,
  onTabChange,
  myApplications,
  myGigs,
  users,
  reviews,
  reviewableGigs,
  appsForGig,
  myReviewFor,
  onOpenGig,
  onOpenProfile,
  onPost,
  onReviewApplication,
  onSetGigStatus,
  onLeaveReview,
}: ActivityViewProps) {
  const myReviews = reviews.filter((r) => r.reviewer_id === me.id)

  return (
    <>
      <div className="section-heading view-heading">
        <div><h2>My activity</h2><p>Everything you have posted and applied to.</p></div>
        <Button className="post-button" onClick={onPost}><Plus data-icon="inline-start" />Post a gig</Button>
      </div>
      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList className="activity-tabs">
          <TabsTrigger value="applications">My applications ({myApplications.length})</TabsTrigger>
          <TabsTrigger value="my-gigs">My gigs ({myGigs.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviewableGigs.length} to leave)</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          {myApplications.length === 0 && <div className="empty-state"><Send /><h3>No applications yet</h3><p>When you apply to a gig, its status will show up here.</p></div>}
          <div className="activity-list">
            {myApplications.map((app) => (
              <Card key={app.id} className="activity-card clickable" onClick={() => onOpenGig(app.gig_id)}>
                <div className="row-between">
                  <button className="link-title" onClick={() => onOpenGig(app.gig_id)}>{app.gig_title}</button>
                  <span className="badge-row"><StatusBadge status={app.gig_status} /><StatusBadge status={app.status} /></span>
                </div>
                <p className="activity-message">“{app.message}”</p>
                <span className="activity-meta">Applied {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-gigs">
          {myGigs.length === 0 && <div className="empty-state"><BriefcaseBusiness /><h3>No gigs posted yet</h3><p>Post your first gig and applications will land here.</p></div>}
          <div className="activity-list">
            {myGigs.map((gig) => {
              const gigApps = appsForGig(gig.id)
              const accepted = gigApps.find((a) => a.status === 'Accepted')
              return (
                <Card key={gig.id} className="activity-card clickable" onClick={() => onOpenGig(gig.id)}>
                  <div className="row-between">
                    <button className="link-title" onClick={() => onOpenGig(gig.id)}>{gig.title}</button>
                    <StatusBadge status={gig.display_status} />
                  </div>
                  <span className="activity-meta">
                    {gig.type} · {gig.category} · {paymentLabel(gig.payment_type)}
                    {gig.budget ? ` · PKR ${Number(gig.budget).toLocaleString('en-US')}` : ''} · Deadline {deadlineInfo(gig.deadline).full}
                  </span>
                  {accepted && (
                    <p className="activity-message">
                      Working with <button className="link-inline" onClick={(e) => { e.stopPropagation(); onOpenProfile(accepted.applicant_id) }}>{accepted.applicant_name}</button>
                    </p>
                  )}
                  {gigApps.length > 0 && (
                    <div className="applicant-list" onClick={(e) => e.stopPropagation()}>
                      {gigApps.map((app) => (
                        <div key={app.id} className="applicant-row">
                          <div className="person">
                            <Avatar name={app.applicant_name} id={app.applicant_id} size="sm" />
                            <div>
                              <button className="link-inline strong" onClick={() => onOpenProfile(app.applicant_id)}>{app.applicant_name}</button>
                              <span>{app.applicant_major}</span>
                            </div>
                          </div>
                          <span className="applicant-message">“{app.message}”</span>
                          {app.status === 'Pending' && gig.display_status === 'Open' ? (
                            <span className="applicant-actions">
                              <Button size="sm" onClick={() => onReviewApplication(app, 'Accepted')}><Check data-icon="inline-start" />Accept</Button>
                              <Button size="sm" variant="outline" className="btn-danger" onClick={() => onReviewApplication(app, 'Rejected')}>Reject</Button>
                            </span>
                          ) : <StatusBadge status={app.status} />}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                    {gig.display_status === 'In Progress' && (
                      <Button size="sm" onClick={() => onSetGigStatus(gig, 'Completed')}><Check data-icon="inline-start" />Mark completed</Button>
                    )}
                    {gig.display_status === 'Open' && (
                      <Button size="sm" variant="outline" className="btn-danger" onClick={() => onSetGigStatus(gig, 'Cancelled')}>Cancel gig</Button>
                    )}
                    {gig.display_status === 'Completed' && !myReviewFor(gig.id) && gig.accepted_applicant_id && (
                      <Button size="sm" variant="outline" className="btn-plain" onClick={() => onLeaveReview(gig)}><Star data-icon="inline-start" />Leave a review</Button>
                    )}
                    {gig.display_status === 'Completed' && myReviewFor(gig.id) && <span className="reviewed-note"><Check /> You reviewed this gig</span>}
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="activity-list">
            {reviewableGigs.map((gig) => {
              const otherId = gig.user_id === me.id ? gig.accepted_applicant_id : gig.user_id
              const other = users.find((u) => u.id === otherId)
              return (
                <Card key={gig.id} className="activity-card clickable" onClick={() => onOpenGig(gig.id)}>
                  <div className="row-between">
                    <button className="link-title" onClick={() => onOpenGig(gig.id)}>{gig.title}</button>
                    <StatusBadge status="Completed" />
                  </div>
                  <p className="activity-message">How did it go with {other?.name}?</p>
                  <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" onClick={() => onLeaveReview(gig)}><Star data-icon="inline-start" />Review {other?.name.split(' ')[0]}</Button>
                  </div>
                </Card>
              )
            })}
            {myReviews.map((r) => (
              <Card key={r.id} className="activity-card clickable" onClick={() => onOpenGig(r.gig_id)}>
                <div className="row-between"><span className="strong-text">{r.gig_title}</span><Stars rating={r.rating} /></div>
                <p className="activity-message">You reviewed {users.find((u) => u.id === r.reviewee_id)?.name}: “{r.comment}”</p>
              </Card>
            ))}
            {reviewableGigs.length === 0 && myReviews.length === 0 && (
              <div className="empty-state"><Star /><h3>Nothing to review</h3><p>Reviews unlock once a gig you are part of is completed.</p></div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
