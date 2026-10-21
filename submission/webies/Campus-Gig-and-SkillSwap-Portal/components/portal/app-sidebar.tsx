'use client'

import { BriefcaseBusiness, Compass, Heart, LayoutDashboard, LogOut, Users } from 'lucide-react'
import type { User } from '@/lib/api'
import { Avatar } from '@/components/portal/avatar'
import { majorLine } from '@/lib/format'

export type PortalView = 'Discover' | 'My activity' | 'Saved' | 'Profile'

type AppSidebarProps = {
  view: PortalView
  onNavigate: (view: PortalView) => void
  onOpenMyGigs: () => void
  activityCount: number
  myGigsCount: number
  savedCount: number
  me: User | undefined
  onOpenProfile: (id: number) => void
  onSignOut: () => void
}

export function AppSidebar({
  view,
  onNavigate,
  onOpenMyGigs,
  activityCount,
  myGigsCount,
  savedCount,
  me,
  onOpenProfile,
  onSignOut,
}: AppSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand"><img src="/logo.png" alt="campusloop logo" className="brand-logo" /><span>campus<span className="brand-accent">loop</span></span></div>
      <nav className="main-nav" aria-label="Main navigation">
        <span className="nav-label">Workspace</span>
        <button className={`nav-item ${view === 'Discover' ? 'active' : ''}`} onClick={() => onNavigate('Discover')}><Compass />Discover</button>
        <button className={`nav-item ${view === 'My activity' ? 'active' : ''}`} onClick={() => onNavigate('My activity')}>
          <LayoutDashboard />My activity{activityCount > 0 && <span className="nav-count">{activityCount}</span>}
        </button>
        <span className="nav-label nav-label-spaced">Your space</span>
        <button className="nav-item" onClick={onOpenMyGigs}><BriefcaseBusiness />My gigs{myGigsCount > 0 && <span className="nav-count">{myGigsCount}</span>}</button>
        <button className={`nav-item ${view === 'Saved' ? 'active' : ''}`} onClick={() => onNavigate('Saved')}><Heart />Saved <span className="nav-count">{savedCount}</span></button>
      </nav>
      <div className="sidebar-bottom">
        {me && (
          <div className="profile-mini-wrap">
            <div className="profile-hover-menu">
              <button onClick={() => onOpenProfile(me.id)}><Users />Profile</button>
              <button onClick={onSignOut}><LogOut />Logout</button>
            </div>
            <button className="profile-mini profile-mini-button" onClick={() => onOpenProfile(me.id)}>
              <Avatar name={me.name} id={me.id} />
              <div><strong>{me.name}</strong><span>{majorLine(me.name, me.major, me.semester)}</span></div>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
