'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type EditProfileForm = { major: string; semester: string; skills: string; bio: string }

type EditProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: EditProfileForm
  setForm: Dispatch<SetStateAction<EditProfileForm>>
  onSubmit: () => void
}

export function EditProfileDialog({ open, onOpenChange, form, setForm, onSubmit }: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gig-dialog">
        <DialogHeader>
          <DialogTitle className="dialog-title">Edit profile</DialogTitle>
          <DialogDescription className="modal-description">This is what other students see on your profile.</DialogDescription>
        </DialogHeader>
        <div className="dialog-form">
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
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>
        </div>
        <div className="modal-actions">
          <Button onClick={onSubmit}>Save changes</Button>
          <Button variant="outline" className="btn-plain" onClick={() => onOpenChange(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
