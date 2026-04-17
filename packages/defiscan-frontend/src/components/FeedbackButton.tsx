import { useEffect, useState } from 'react'
import { useFeedbackModal } from '../contexts/FeedbackModalContext'

const TALLY_FORM_ID = 'Ek0oer'
const TALLY_FORM_URL = `https://tally.so/r/${TALLY_FORM_ID}?transparentBackground=1`

export function FeedbackButton() {
  const { isFeedbackOpen, openFeedback, closeFeedback } = useFeedbackModal()
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  useEffect(() => {
    const footer = document.getElementById('site-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry?.isIntersecting ?? false),
      { threshold: 0 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <button
        onClick={openFeedback}
        className={`fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-accent-dark px-4 py-2.5 font-medium text-sm text-white shadow-lg transition-all hover:bg-blue-800 hover:shadow-xl active:scale-95 ${
          isFooterVisible
            ? 'pointer-events-none translate-y-4 opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
        aria-label="Send feedback"
        aria-hidden={isFooterVisible}
        tabIndex={isFooterVisible ? -1 : 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.102 41.102 0 01-3.55.414c-.28.02-.521.18-.643.413l-1.712 3.293a.75.75 0 01-1.33 0l-1.713-3.293a.783.783 0 00-.642-.413 41.108 41.108 0 01-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902z"
            clipRule="evenodd"
          />
        </svg>
        Feedback
      </button>

      {isFeedbackOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={closeFeedback}
        >
          <div
            className="relative h-[85vh] max-h-[700px] w-[90vw] max-w-[600px] overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeFeedback}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close feedback form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <iframe
              src={TALLY_FORM_URL}
              title="DeFiScan Feedback"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  )
}
