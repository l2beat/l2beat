import React, { ReactNode, useEffect } from 'react'

import { configureDarkMode } from '../../scripts/configureDarkMode'

export interface StoryPageProps {
  children: ReactNode
}

export function StoryPage({ children }: StoryPageProps) {
  useEffect(() => {
    configureDarkMode()
  }, [])
  return <div className="Page leading-[1.15]">{children}</div>
}
