import { colorFor, initials } from '@/lib/format'

export function Avatar({ name, id, size = 'md' }: { name: string; id: number; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`avatar avatar-${colorFor(id)} avatar-${size}`}>{initials(name)}</div>
}
