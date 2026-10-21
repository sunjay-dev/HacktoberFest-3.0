'use client'

import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORIES, PAYMENT_OPTIONS, TYPE_OPTIONS } from '@/lib/constants'

export type PostGigForm = {
  title: string
  type: string
  category: string
  payment_type: string
  budget: string
  deadline: string
  description: string
}

type PostGigDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: PostGigForm
  setForm: Dispatch<SetStateAction<PostGigForm>>
  error: string
  onSubmit: () => void
}

export function PostGigDialog({ open, onOpenChange, form, setForm, error, onSubmit }: PostGigDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next) }}>
      <DialogContent className="gig-dialog">
        <DialogHeader>
          <DialogTitle className="dialog-title">Post a gig</DialogTitle>
          <DialogDescription className="modal-description">Say what you need, or what you can do.</DialogDescription>
        </DialogHeader>
        <div className="dialog-form">
          <div>
            <Label htmlFor="post-title">Gig title</Label>
            <Input id="post-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Help me build a portfolio site" />
          </div>
          <div className="form-row">
            <div>
              <Label>What are you posting?</Label>
              <Select items={TYPE_OPTIONS} value={form.type} onValueChange={(v) => v && setForm({ ...form, type: v })}>
                <SelectTrigger className="form-select"><SelectValue>{form.type === 'Requesting' ? "I'm looking for help" : "I'm offering help"}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Requesting">I&apos;m looking for help</SelectItem>
                  <SelectItem value="Offering">I&apos;m offering help</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select items={CATEGORIES.map((c) => ({ label: c, value: c }))} value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v })}>
                <SelectTrigger className="form-select"><SelectValue>{form.category}</SelectValue></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <Label>Payment type</Label>
              <Select items={PAYMENT_OPTIONS} value={form.payment_type} onValueChange={(v) => v && setForm({ ...form, payment_type: v })}>
                <SelectTrigger className="form-select"><SelectValue>{form.payment_type === 'SkillSwap' ? 'Skill swap' : form.payment_type}</SelectValue></SelectTrigger>
                <SelectContent>{PAYMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.payment_type === 'Paid' ? (
              <div>
                <Label htmlFor="post-budget">Budget (PKR)</Label>
                <Input id="post-budget" type="number" min="1" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 100" />
              </div>
            ) : (
              <div>
                <Label htmlFor="post-deadline">Deadline</Label>
                <Input id="post-deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            )}
          </div>
          {form.payment_type === 'Paid' && (
            <div>
              <Label htmlFor="post-deadline-paid">Deadline</Label>
              <Input id="post-deadline-paid" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          )}
          <div>
            <Label htmlFor="post-desc">Describe your gig</Label>
            <Textarea id="post-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add details about the project, expectations, and timeline..." rows={4} />
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-actions">
          <Button onClick={onSubmit}>Publish gig <ArrowRight data-icon="inline-end" /></Button>
          <Button variant="outline" className="btn-plain" onClick={() => onOpenChange(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
