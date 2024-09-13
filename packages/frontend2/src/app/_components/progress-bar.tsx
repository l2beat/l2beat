'use client'

import { Next13ProgressBar } from 'next13-progressbar'

export function ProgressBar() {
  return (
    <Next13ProgressBar
      height="4px"
      color="#F9347B"
      options={{ showSpinner: false }}
      showOnShallow
    />
  )
}
