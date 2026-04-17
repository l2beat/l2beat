import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface FeedbackModalContextValue {
  isFeedbackOpen: boolean
  openFeedback: () => void
  closeFeedback: () => void
}

const FeedbackModalContext = createContext<FeedbackModalContextValue | null>(null)

export function useFeedbackModal() {
  const ctx = useContext(FeedbackModalContext)
  if (!ctx) throw new Error('useFeedbackModal must be used within FeedbackModalProvider')
  return ctx
}

export function FeedbackModalProvider({ children }: { children: ReactNode }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const openFeedback = useCallback(() => setIsFeedbackOpen(true), [])
  const closeFeedback = useCallback(() => setIsFeedbackOpen(false), [])

  return (
    <FeedbackModalContext.Provider value={{ isFeedbackOpen, openFeedback, closeFeedback }}>
      {children}
    </FeedbackModalContext.Provider>
  )
}
