'use client'

import { Pencil, Star, Users } from 'lucide-react'
import type { Gig, Profile, User } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/portal/avatar'
import { StatusBadge } from '@/components/portal/status-badge'
import { Stars } from '@/components/portal/stars'
import { ProfileSkeleton } from '@/components/portal/skeletons'
import { deadlineInfo, majorLine, paymentLabel } from '@/lib/format'

type ProfileViewProps = {
  profile: Profile | null
  loading: boolean
  me: User | undefined
  allGigs: Gig[]
  onOpenGig: (id: number) => void
  onEditProfile: () => void
}

export function ProfileView({ profile, loading, me, allGigs, onOpenGig, onEditProfile }: ProfileViewProps) {
  const profileGigs = profile ? allGigs.filter((g) => g.user_id === profile.id) : []

  return (
    <>
      <div className="section-heading view-heading">
        <div>
          <h2>{profile?.id === me?.id ? 'My profile' : 'Profile'}</h2>
          <p>Ratings come from completed-gig reviews.</p>
        </div>
      </div>
      {loading ? (
        <ProfileSkeleton />
      ) : !profile ? (
        <div className="empty-state"><Users /><h3>Could not load this profile</h3><p>Try opening it again from Discover.</p></div>
      ) : (
        <>
          <Card className="profile-card">
            <div className="profile-head">
              <Avatar name={profile.name} id={profile.id} size="lg" />
              <div>
                <h3>{profile.name}</h3>
                <span>{majorLine(profile.name, profile.major, profile.semester)} · Semester {profile.semester}</span>
                <div className="profile-rating">
                  {profile.average_rating ? (
                    <>
                      <Stars rating={profile.average_rating} size={15} />
                      <strong>{profile.average_rating}</strong>
                      <span>({profile.review_count} review{profile.review_count === 1 ? '' : 's'})</span>
                    </>
                  ) : <span>No reviews yet</span>}
                </div>
              </div>
              {profile.id === me?.id && (
                <Button size="sm" variant="outline" className="btn-plain edit-profile-btn" onClick={onEditProfile}>
                  <Pencil data-icon="inline-start" />Edit profile
                </Button>
              )}
            </div>
            <p className="modal-description">{profile.bio}</p>
            {profile.skills.length > 0 && <p className="gig-meta-line profile-skills-line">Skills: {profile.skills.join(' · ')}</p>}
            <Separator />
            <div className="profile-stats">
              <div><strong>{profile.gigs_posted}</strong><span>Gigs posted</span></div>
              <div><strong>{profile.gigs_completed}</strong><span>Gigs completed</span></div>
              <div><strong>{profile.average_rating ?? '—'}</strong><span>Average rating</span></div>
            </div>
          </Card>

          <div className="section-heading profile-section"><div><h2>Reviews received</h2></div></div>
          {profile.reviews_received.length === 0 && (
            <div className="empty-state"><Star /><h3>No reviews yet</h3><p>Completed gigs will bring reviews here.</p></div>
          )}
          <div className="activity-list">
            {profile.reviews_received.map((r) => (
              <Card key={r.id} className="activity-card">
                <div className="row-between">
                  <span className="strong-text">{r.reviewer_name} · {r.gig_title}</span>
                  <Stars rating={r.rating} />
                </div>
                <p className="activity-message">“{r.comment}”</p>
              </Card>
            ))}
          </div>

          <div className="section-heading profile-section">
            <div><h2>{profile.id === me?.id ? 'Your gigs' : `Gigs by ${profile.name.split(' ')[0]}`}</h2></div>
          </div>
          <div className="activity-list">
            {profileGigs.map((g) => (
              <Card key={g.id} className="activity-card">
                <div className="row-between">
                  <button className="link-title" onClick={() => onOpenGig(g.id)}>{g.title}</button>
                  <StatusBadge status={g.display_status} />
                </div>
                <span className="activity-meta">
                  {g.type} · {g.category} · {paymentLabel(g.payment_type)}
                  {g.budget ? ` · PKR ${Number(g.budget).toLocaleString('en-US')}` : ''} · Deadline {deadlineInfo(g.deadline).full}
                </span>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  )
}
