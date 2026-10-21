import type { Gig } from '@/lib/api'
import { COLORS } from '@/lib/constants'

export const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('')

export const colorFor = (id: number) => COLORS[(id - 1) % COLORS.length]

export const yearLabel = (semester: number) =>
  semester <= 2 ? 'Freshman' : semester <= 4 ? 'Sophomore' : semester <= 6 ? 'Junior' : 'Senior'

export const majorLine = (name: string, major: string, semester?: number) =>
  semester ? `${major} · ${yearLabel(semester)}` : major

export const paymentLabel = (p: Gig['payment_type']) => (p === 'SkillSwap' ? 'Skill swap' : p)

export const paymentText = (gig: Gig) =>
  gig.payment_type === 'Paid'
    ? `Paid · PKR ${Number(gig.budget).toLocaleString('en-US')}`
    : paymentLabel(gig.payment_type)

export const budgetText = (budget: number | null) =>
  budget ? `PKR ${Number(budget).toLocaleString('en-US')}` : ''

export function deadlineInfo(deadline: string) {
  const date = new Date(`${deadline.slice(0, 10)}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000)
  const label = diff < 0 ? `${-diff}d ago` : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff} days left`
  return { label, full: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
}
