import { useEffect, useState } from 'react'
import { useIsMobile } from './use-is-mobile'

const DEFAULT_THRESHOLD = `15%`

type ThresholdValue = `${number}%` | `${number}px`

interface Threshold {
  desktop?: ThresholdValue
  mobile?: ThresholdValue
}

export function useCurrentSection(threshold?: Threshold) {
  const isMobile = useIsMobile()
  const [currentSection, setCurrentSection] = useState<HTMLElement>()

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('section'),
    )
    const firstSection = sections.at(0)
    const lastSection = sections.at(-1)

    function findCurrentSection() {
      if (isScrolledToTop()) {
        setCurrentSection(firstSection)
        return
      }
      if (isScrolledToBottom()) {
        setCurrentSection(lastSection)
        return
      }
      const currentSection = sections.find((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionBottom = sectionTop + sectionHeight

        const scrollPos =
          window.scrollY + getViewportHeightOffset(threshold, isMobile)
        const isCurrentSection =
          scrollPos >= sectionTop && scrollPos < sectionBottom
        return isCurrentSection
      })

      if (!currentSection) return

      setCurrentSection(currentSection)
    }
    findCurrentSection()
    document.addEventListener('scroll', findCurrentSection)
  }, [isMobile, threshold])

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
