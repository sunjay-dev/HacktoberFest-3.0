'use client'

import { Filter, Plus, Search, X } from 'lucide-react'
import type { Gig } from '@/lib/api'
import { CATEGORIES, GIG_MODES, PAYMENT_OPTIONS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GigCard } from '@/components/portal/gig-card'
import { GigGridSkeleton } from '@/components/portal/skeletons'

type DiscoverViewProps = {
  gigs: Gig[]
  ready: boolean
  query: string
  onQueryChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  payment: string
  onPaymentChange: (value: string) => void
  minBudget: string
  onMinBudgetChange: (value: string) => void
  maxBudget: string
  onMaxBudgetChange: (value: string) => void
  mode: string
  onModeChange: (value: string) => void
  savedIds: number[]
  onToggleSave: (id: number) => void
  onOpenGig: (id: number) => void
  onPost: () => void
}

export function DiscoverView({
  gigs,
  ready,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  payment,
  onPaymentChange,
  minBudget,
  onMinBudgetChange,
  maxBudget,
  onMaxBudgetChange,
  mode,
  onModeChange,
  savedIds,
  onToggleSave,
  onOpenGig,
  onPost,
}: DiscoverViewProps) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <h1>Campus gigs</h1>
          <p className="welcome-copy">Small jobs and skill swaps posted by Northwestern students.</p>
        </div>
        <Button className="post-button" onClick={onPost}><Plus data-icon="inline-start" />Post a gig</Button>
      </section>

      <div className="filters">
        <div className="search-wrap">
          <Search />
          <Input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search gigs, skills, or keywords..." aria-label="Search gigs" />
        </div>
        <Select items={[{ label: 'All categories', value: 'all' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]} value={category} onValueChange={(v) => v && onCategoryChange(v)}>
          <SelectTrigger className="filter-select" aria-label="Filter by category"><SelectValue>{category === 'all' ? 'All categories' : category}</SelectValue></SelectTrigger>
          <SelectContent><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={[{ label: 'Any payment', value: 'all' }, ...PAYMENT_OPTIONS]} value={payment} onValueChange={(v) => v && onPaymentChange(v)}>
          <SelectTrigger className="filter-select" aria-label="Filter by payment type"><SelectValue>{payment === 'all' ? 'Any payment' : payment === 'SkillSwap' ? 'Skill swap' : payment}</SelectValue></SelectTrigger>
          <SelectContent><SelectItem value="all">Any payment</SelectItem>{PAYMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="filters filters-budget">
        <span className="budget-label"><Filter /> Budget</span>
        <Input type="number" min="0" value={minBudget} onChange={(e) => onMinBudgetChange(e.target.value)} placeholder="Min PKR" aria-label="Minimum budget" className="budget-input" />
        <span className="budget-dash">–</span>
        <Input type="number" min="0" value={maxBudget} onChange={(e) => onMaxBudgetChange(e.target.value)} placeholder="Max PKR" aria-label="Maximum budget" className="budget-input" />
        {(minBudget || maxBudget) && (
          <button className="text-button" onClick={() => { onMinBudgetChange(''); onMaxBudgetChange('') }}><X /> Clear</button>
        )}
      </div>

      <div className="mode-tabs" role="tablist">
        {GIG_MODES.map((item) => (
          <button key={item} className={mode === item ? 'selected' : ''} onClick={() => onModeChange(item)}>
            {item}{item === 'All gigs' && <span>{gigs.length}</span>}
          </button>
        ))}
      </div>

      {!ready ? (
        <GigGridSkeleton />
      ) : (
        <div className="gig-grid">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} saved={savedIds.includes(gig.id)} onToggleSave={onToggleSave} onOpen={onOpenGig} />
          ))}
        </div>
      )}
      {ready && gigs.length === 0 && (
        <div className="empty-state"><Search /><h3>No gigs found</h3><p>Try another keyword or reset your filters.</p></div>
      )}
    </>
  )
}
