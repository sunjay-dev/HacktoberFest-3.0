import { Star } from 'lucide-react'

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(rating) ? 'star-on' : 'star-off'} />
      ))}
    </span>
  )
}
