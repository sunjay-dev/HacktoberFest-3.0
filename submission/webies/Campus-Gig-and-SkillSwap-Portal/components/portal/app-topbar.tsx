'use client'

import { Compass, Heart, LayoutDashboard, LogOut, Users } from 'lucide-react'
import type { User } from '@/lib/api'
import { Avatar } from '@/components/portal/avatar'
import type { PortalView } from '@/components/portal/app-sidebar'

type AppTopbarProps = {
  me: User | undefined
  onOpenProfile: (id: number) => void
  onSignOut: () => void
}

export function AppTopbar({ me, onOpenProfile, onSignOut }: AppTopbarProps) {
  return (
    <header className="topbar">
      <div className="mobile-brand"><img src="/logo.png" alt="campusloop logo" className="brand-logo" /><span>campus<span className="brand-accent">loop</span></span></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Sign out" title="Sign out" onClick={onSignOut}><LogOut /></button>
        {me && <button className="profile-trigger" onClick={() => onOpenProfile(me.id)}><Avatar name={me.name} id={me.id} size="sm" /></button>}
      </div>
    </header>
  )
}

type MobileNavProps = {
  view: PortalView
  me: User | undefined
  onNavigate: (view: PortalView) => void
  onOpenProfile: (id: number) => void
}

export function MobileNav({ view, me, onNavigate, onOpenProfile }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <button className={view === 'Discover' ? 'active' : ''} onClick={() => onNavigate('Discover')}><Compass />Discover</button>
      <button className={view === 'My activity' ? 'active' : ''} onClick={() => onNavigate('My activity')}><LayoutDashboard />My activity</button>
      <button className={view === 'Saved' ? 'active' : ''} onClick={() => onNavigate('Saved')}><Heart />Saved</button>
      <button className={view === 'Profile' ? 'active' : ''} onClick={() => me && onOpenProfile(me.id)}><Users />Profile</button>
    </nav>
  )
}
