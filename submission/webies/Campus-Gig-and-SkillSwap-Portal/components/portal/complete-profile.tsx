'use client'

import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type CompleteProfileForm = { major: string; semester: string; skills: string; bio: string }

type CompleteProfileProps = {
  email: string
  form: CompleteProfileForm
  setForm: Dispatch<SetStateAction<CompleteProfileForm>>
  onSubmit: () => void
  onSignOut: () => void
  toast: string
}

export function CompleteProfile({ email, form, setForm, onSubmit, onSignOut, toast }: CompleteProfileProps) {
  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <div className="auth-brand"><img src="/logo.png" alt="campusloop logo" className="brand-logo" /><span>campus<span className="brand-accent">loop</span></span></div>
        <h1 className="auth-title">Finish your profile</h1>
        <p className="modal-description">Signed in as {email} — add the details other students will see.</p>
        <div className="dialog-form auth-form">
          <div className="form-row">
            <div>
              <Label>Major</Label>
              <Input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} placeholder="Your major" />
            </div>
            <div>
              <Label>Semester</Label>
              <Input type="number" min="1" max="12" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Skills (comma separated)</Label>
            <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Figma, Proofreading" />
          </div>
          <div>
            <Label>Short bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="What do you study, what are you good at..." />
          </div>
          <Button className="auth-submit" onClick={onSubmit}>Save profile <ArrowRight data-icon="inline-end" /></Button>
          <Button variant="outline" className="btn-plain" onClick={onSignOut}>Sign out</Button>
        </div>
      </Card>
      {toast && <div className="toast"><Check />{toast}</div>}
    </div>
  )
}
