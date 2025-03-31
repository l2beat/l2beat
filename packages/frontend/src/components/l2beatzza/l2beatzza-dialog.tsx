'use client'
import { useState } from 'react'
import { createContext, useContext } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../core/dialog'
import { StepController } from './pizza-flow'

type L2BeatzzaDialogContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const L2BeatzzaDialogContext =
  createContext<L2BeatzzaDialogContextProps | null>(null)

export function L2BeatzzaDialogProvider({
  children,
}: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <L2BeatzzaDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </L2BeatzzaDialogContext.Provider>
  )
}

export function useL2BeatzzaDialog() {
  const context = useContext(L2BeatzzaDialogContext)
  if (!context) {
    throw new Error(
      'useL2BeatzzaDialog must be used within a L2BeatzzaDialogProvider.',
    )
  }

  return context
}

export function L2BeatzzaDialog() {
  const { open, setOpen } = useL2BeatzzaDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex items-center justify-center bg-surface-primary pt-16 md:left-1/2 md:top-1/2 md:h-[560px] md:max-w-[800px] md:-translate-x-1/2 md:-translate-y-1/2"
        fullScreenMobile
      >
        <DialogTitle className="hidden">Pizza time</DialogTitle>
        <StepController />
        <DialogClose className="absolute right-5 top-5 flex size-[20px] items-center justify-center rounded-sm bg-brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary-invert"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
