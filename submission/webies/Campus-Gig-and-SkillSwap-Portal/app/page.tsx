'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { api, type Application, type Gig, type Profile, type Review, type User } from '@/lib/api'
import LandingPage from '@/components/landing'
import { useDiscoverGigs } from '@/hooks/use-discover-gigs'
import { AppSidebar, type PortalView } from '@/components/portal/app-sidebar'
import { AppTopbar, MobileNav } from '@/components/portal/app-topbar'
import { ActivityView } from '@/components/portal/activity-view'
import { CompleteProfile, type CompleteProfileForm } from '@/components/portal/complete-profile'
import { DiscoverView } from '@/components/portal/discover-view'
import { ProfileView } from '@/components/portal/profile-view'
import { SavedView } from '@/components/portal/saved-view'
import { EditProfileDialog, type EditProfileForm } from '@/components/portal/dialogs/edit-profile-dialog'
import { GigDetailDialog } from '@/components/portal/dialogs/gig-detail-dialog'
import { PostGigDialog, type PostGigForm } from '@/components/portal/dialogs/post-gig-dialog'
import { ReviewDialog } from '@/components/portal/dialogs/review-dialog'

const EMPTY_PROFILE_FORM: CompleteProfileForm = { major: 'Computer Science', semester: '5', skills: '', bio: '' }
const EMPTY_EDIT_FORM: EditProfileForm = { major: '', semester: '5', skills: '', bio: '' }
const EMPTY_POST_FORM: PostGigForm = {
  title: '',
  type: 'Requesting',
  category: 'Programming',
  payment_type: 'Paid',
  budget: '',
  deadline: '',
  description: '',
}

export default function Page() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [view, setView] = useState<PortalView>('Discover')
  const [activityTab, setActivityTab] = useState('applications')
  const [authEmail, setAuthEmail] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const [allGigs, setAllGigs] = useState<Gig[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [savedIds, setSavedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(window.localStorage.getItem('cg-saved') || '[]') } catch { return [] }
  })

  const [profileId, setProfileId] = useState<number>(1)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const profileLoadedFor = useRef<number | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editForm, setEditForm] = useState<EditProfileForm>(EMPTY_EDIT_FORM)

  const [completeForm, setCompleteForm] = useState<CompleteProfileForm>(EMPTY_PROFILE_FORM)
  const [selectedGigId, setSelectedGigId] = useState<number | null>(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [showPost, setShowPost] = useState(false)
  const [postForm, setPostForm] = useState<PostGigForm>(EMPTY_POST_FORM)
  const [postError, setPostError] = useState('')
  const [reviewGig, setReviewGig] = useState<Gig | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [toast, setToast] = useState('')

  const discover = useDiscoverGigs(allGigs)

  const me = users.find((u) => u.email && (u.email === authEmail || u.email === session?.user?.email))
  const selectedGig = allGigs.find((g) => g.id === selectedGigId) || null

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const loadAll = useCallback(async () => {
    try {
      const [u, g, a, r] = await Promise.all([api.users(), api.gigs(), api.applications(), api.reviews()])
      setUsers(u)
      setAllGigs(g)
      setApplications(a)
      setReviews(r)
      setLoadError('')
    } catch {
      setLoadError('Could not reach the API. Is the backend running? (pnpm dev starts both)')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    if (view !== 'Profile') return
    if (profileLoadedFor.current !== profileId) setProfileLoading(true)
    api.user(profileId)
      .then((u) => { setProfile(u); profileLoadedFor.current = profileId })
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false))
  }, [view, profileId, allGigs, reviews])

  useEffect(() => { window.localStorage.setItem('cg-saved', JSON.stringify(savedIds)) }, [savedIds])

  // One definitive session check on mount (avoids bouncing to /login on a
  // stale empty session state right after signing in).
  useEffect(() => {
    authClient.getSession()
      .then(({ data }) => {
        setAuthEmail(data?.user?.email ?? null)
        setAuthChecked(true)
      })
      .catch(() => { setAuthChecked(true) })
  }, [router])

  async function doSignOut() {
    await authClient.signOut()
    setAuthEmail(null)
    router.push('/')
  }

  async function doCompleteProfile() {
    try {
      await api.createProfile({ major: completeForm.major, semester: Number(completeForm.semester), bio: completeForm.bio, skills: completeForm.skills })
      notify('Profile saved — welcome to campusloop!')
      await loadAll()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save profile')
    }
  }

  function openEditProfile() {
    if (!profile) return
    setEditForm({ major: profile.major, semester: String(profile.semester), skills: profile.skills.join(', '), bio: profile.bio })
    setShowEditProfile(true)
  }

  async function doEditProfile() {
    try {
      await api.updateProfile({ major: editForm.major, semester: Number(editForm.semester), bio: editForm.bio, skills: editForm.skills })
      setShowEditProfile(false)
      notify('Profile updated')
      await loadAll()
      api.user(profileId).then(setProfile).catch(() => {})
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update profile')
    }
  }

  function openProfile(id: number) {
    setProfileId(id)
    setSelectedGigId(null)
    setView('Profile')
  }

  function toggleSaved(id: number) {
    setSavedIds((ids) => ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id])
  }

  const myApplications = useMemo(() => applications.filter((a) => a.applicant_id === me?.id), [applications, me])
  const myGigs = useMemo(() => allGigs.filter((g) => g.user_id === me?.id), [allGigs, me])
  const appsForGig = useCallback((gigId: number) => applications.filter((a) => a.gig_id === gigId), [applications])
  const myAppFor = useCallback((gigId: number) => applications.find((a) => a.gig_id === gigId && a.applicant_id === me?.id), [applications, me])
  const myReviewFor = useCallback((gigId: number) => reviews.find((r) => r.gig_id === gigId && r.reviewer_id === me?.id), [reviews, me])
  const savedGigs = useMemo(() => allGigs.filter((g) => savedIds.includes(g.id)), [allGigs, savedIds])

  const reviewableGigs = useMemo(
    () => allGigs.filter((g) => g.display_status === 'Completed' && (g.user_id === me?.id || g.accepted_applicant_id === me?.id) && !myReviewFor(g.id)),
    [allGigs, me, myReviewFor],
  )

  function openReview(gig: Gig) {
    setReviewGig(gig)
    setReviewRating(5)
    setReviewComment('')
  }

  async function doApply(gig: Gig) {
    if (!me) return
    try {
      await api.apply({ gig_id: gig.id, applicant_id: me.id, message: applyMessage })
      setApplyMessage('')
      setSelectedGigId(null)
      notify('Application sent. Good luck!')
      await loadAll()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not apply')
    }
  }

  async function doReviewApplication(app: Application, status: 'Accepted' | 'Rejected') {
    if (!me) return
    try {
      await api.reviewApplication(app.id, me.id, status)
      notify(status === 'Accepted' ? `${app.applicant_name} accepted — gig is now In Progress` : 'Application rejected')
      await loadAll()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Action failed')
    }
  }

  async function doGigStatus(gig: Gig, status: 'Completed' | 'Cancelled') {
    if (!me) return
    try {
      await api.setGigStatus(gig.id, me.id, status)
      notify(status === 'Completed' ? 'Gig marked as completed' : 'Gig cancelled')
      await loadAll()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Action failed')
    }
  }

  async function doPostGig() {
    if (!me) return
    setPostError('')
    try {
      const gig = await api.createGig({
        user_id: me.id,
        title: postForm.title,
        description: postForm.description,
        type: postForm.type,
        category: postForm.category,
        payment_type: postForm.payment_type,
        budget: postForm.payment_type === 'Paid' ? Number(postForm.budget) : null,
        deadline: postForm.deadline,
      })
      setShowPost(false)
      setPostForm(EMPTY_POST_FORM)
      notify('Your gig is live')
      await loadAll()
      setSelectedGigId(gig.id)
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Could not post gig')
    }
  }

  async function doReview() {
    if (!me || !reviewGig) return
    try {
      await api.createReview({ gig_id: reviewGig.id, reviewer_id: me.id, rating: reviewRating, comment: reviewComment })
      setReviewGig(null)
      setReviewComment('')
      setReviewRating(5)
      notify('Review submitted — thank you!')
      await loadAll()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not submit review')
    }
  }

  if (authChecked && !authEmail) {
    return <LandingPage />
  }

  if (!authChecked || !authEmail) {
    return (
      <div className="auth-shell">
        <div className="auth-loading"><img src="/logo.png" alt="campusloop logo" className="brand-logo" /><span>campus<span className="brand-accent">loop</span></span></div>
      </div>
    )
  }

  if (!loading && !loadError && !me) {
    return (
      <CompleteProfile
        email={authEmail}
        form={completeForm}
        setForm={setCompleteForm}
        onSubmit={doCompleteProfile}
        onSignOut={doSignOut}
        toast={toast}
      />
    )
  }

  return (
    <div className="app-shell">
      <AppSidebar
        view={view}
        onNavigate={setView}
        onOpenMyGigs={() => { setActivityTab('my-gigs'); setView('My activity') }}
        activityCount={myApplications.length + reviewableGigs.length}
        myGigsCount={myGigs.length}
        savedCount={savedIds.length}
        me={me}
        onOpenProfile={openProfile}
        onSignOut={doSignOut}
      />

      <main className="main-content">
        <AppTopbar me={me} onOpenProfile={openProfile} onSignOut={doSignOut} />
        <MobileNav view={view} me={me} onNavigate={setView} onOpenProfile={openProfile} />

        <div className="content-wrap">
          {loadError && <div className="error-banner">{loadError}</div>}

          {view === 'Discover' && (
            <DiscoverView
              gigs={discover.gigs}
              ready={discover.ready}
              query={discover.query}
              onQueryChange={discover.setQuery}
              category={discover.category}
              onCategoryChange={discover.setCategory}
              payment={discover.payment}
              onPaymentChange={discover.setPayment}
              minBudget={discover.minBudget}
              onMinBudgetChange={discover.setMinBudget}
              maxBudget={discover.maxBudget}
              onMaxBudgetChange={discover.setMaxBudget}
              mode={discover.mode}
              onModeChange={discover.setMode}
              savedIds={savedIds}
              onToggleSave={toggleSaved}
              onOpenGig={setSelectedGigId}
              onPost={() => setShowPost(true)}
            />
          )}

          {view === 'Saved' && (
            <SavedView
              gigs={savedGigs}
              loading={loading}
              savedIds={savedIds}
              onToggleSave={toggleSaved}
              onOpenGig={setSelectedGigId}
              onPost={() => setShowPost(true)}
            />
          )}

          {view === 'My activity' && me && (
            <ActivityView
              me={me}
              tab={activityTab}
              onTabChange={setActivityTab}
              myApplications={myApplications}
              myGigs={myGigs}
              users={users}
              reviews={reviews}
              reviewableGigs={reviewableGigs}
              appsForGig={appsForGig}
              myReviewFor={myReviewFor}
              onOpenGig={setSelectedGigId}
              onOpenProfile={openProfile}
              onPost={() => setShowPost(true)}
              onReviewApplication={doReviewApplication}
              onSetGigStatus={doGigStatus}
              onLeaveReview={openReview}
            />
          )}

          {view === 'Profile' && (
            <ProfileView
              profile={profile}
              loading={profileLoading}
              me={me}
              allGigs={allGigs}
              onOpenGig={setSelectedGigId}
              onEditProfile={openEditProfile}
            />
          )}
        </div>
      </main>

      <GigDetailDialog
        gig={selectedGig}
        me={me ?? null}
        applications={applications}
        applyMessage={applyMessage}
        onApplyMessageChange={setApplyMessage}
        myApplication={selectedGig ? myAppFor(selectedGig.id) : undefined}
        reviewed={selectedGig ? !!myReviewFor(selectedGig.id) : false}
        onClose={() => { setSelectedGigId(null); setApplyMessage('') }}
        onOpenProfile={openProfile}
        onApply={doApply}
        onReviewApplication={doReviewApplication}
        onSetGigStatus={doGigStatus}
        onLeaveReview={openReview}
      />

      <EditProfileDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        form={editForm}
        setForm={setEditForm}
        onSubmit={doEditProfile}
      />

      <PostGigDialog
        open={showPost}
        onOpenChange={(open) => { setShowPost(open); if (!open) setPostError('') }}
        form={postForm}
        setForm={setPostForm}
        error={postError}
        onSubmit={doPostGig}
      />

      <ReviewDialog
        gig={reviewGig}
        me={me ?? null}
        users={users}
        rating={reviewRating}
        onRatingChange={setReviewRating}
        comment={reviewComment}
        onCommentChange={setReviewComment}
        onClose={() => setReviewGig(null)}
        onSubmit={doReview}
      />

      {toast && <div className="toast"><Check />{toast}</div>}
    </div>
  )
}
