import { useCallback, useEffect, useState } from 'react'
import { useEventListener } from './useEventListener'
import { useIsMobile } from './useIsMobile'

const DEFAULT_THRESHOLD = '20%'

type ThresholdValue = `${number}%` | `${number}px`

interface Threshold {
  desktop?: ThresholdValue
  mobile?: ThresholdValue
}

export function useCurrentSection(threshold?: Threshold) {
  const isMobile = useIsMobile()
  const [currentSection, setCurrentSection] = useState<HTMLElement>()

  const findCurrentSection = useCallback(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-role="project-section"]'),
    )
    const firstSection = sections.at(0)
    const lastSection = sections.at(-1)

    if (isScrolledToTop()) {
      setCurrentSection(firstSection)
      return
    }
    if (isScrolledToBottom()) {
      setCurrentSection(lastSection)
      return
    }

    const current = sections.findLast((section) => {
      return (
        section.getBoundingClientRect().top <
        getViewportHeightOffset(threshold, isMobile)
      )
    })
    if (!current) return

    setCurrentSection(current)
  }, [isMobile, threshold])

  useEffect(() => {
    findCurrentSection()
  }, [findCurrentSection])
  useEventListener('scroll', findCurrentSection)

  return currentSection
}

function getViewportHeightOffset(
  threshold: Threshold | undefined,
  isMobile: boolean,
) {
  const desktopThreshold = threshold?.desktop ?? DEFAULT_THRESHOLD
  const mobileThreshold = threshold?.mobile ?? DEFAULT_THRESHOLD
  const thresholdValue = isMobile ? mobileThreshold : desktopThreshold

  if (thresholdValue.endsWith('%')) {
    return (window.innerHeight * Number(thresholdValue.slice(0, -1))) / 100
  }

  return Number(thresholdValue.slice(0, -2))
}

function isScrolledToBottom() {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrolledToBottom = scrollTop + clientHeight >= scrollHeight
  return scrolledToBottom
}

function isScrolledToTop() {
  const scrollTop = document.documentElement.scrollTop
  return scrollTop === 0
}
