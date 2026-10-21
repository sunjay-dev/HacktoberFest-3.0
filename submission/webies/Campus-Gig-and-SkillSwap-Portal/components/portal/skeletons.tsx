import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function GigGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="gig-grid" aria-busy="true" aria-label="Loading gigs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gig-card gig-card-skeleton">
          <div className="gig-card-top">
            <Skeleton className="h-[22px] w-24" />
            <Skeleton className="h-[15px] w-[15px] rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2.5 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-5/6" />
          <Skeleton className="mt-3.5 h-3 w-2/3" />
          <div className="gig-card-footer">
            <div className="person">
              <Skeleton className="h-[29px] w-[29px] rounded-full" />
              <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-1 h-2.5 w-14" /></div>
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading profile">
      <Card className="profile-card">
        <div className="profile-head">
          <Skeleton className="h-[45px] w-[45px] rounded-full" />
          <div>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="mt-2 h-3.5 w-64" />
            <Skeleton className="mt-2 h-3.5 w-32" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-3 h-3.5 w-56" />
        </div>
        <Separator />
        <div className="profile-stats">
          {[0, 1, 2].map((i) => (
            <div key={i}><Skeleton className="h-6 w-10" /><Skeleton className="mt-1.5 h-3 w-20" /></div>
          ))}
        </div>
      </Card>
      <div className="section-heading profile-section"><Skeleton className="h-6 w-44" /></div>
      <div className="activity-list">
        {[0, 1].map((i) => (
          <Card key={i} className="activity-card">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
      <div className="section-heading profile-section"><Skeleton className="h-6 w-32" /></div>
      <div className="activity-list">
        {[0, 1].map((i) => (
          <Card key={i} className="activity-card">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3.5 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  )
}
