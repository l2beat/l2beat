import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/**
 * The provider is the one place that knows which tooltip is open. Opening a
 * tooltip closes the previous one, and right after one closes the next opens
 * without its hover delay, as in Radix.
 */
type Provider = {
  delayDuration: number
  disableHoverableContent: boolean
  isOpenDelayedRef: React.RefObject<boolean>
  noteOpen: (close: () => void) => void
  noteClose: (close: () => void) => void
}

const ProviderContext = createContext<Provider | null>(null)

export function TooltipProvider({
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  children,
}: {
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  children: React.ReactNode
}) {
  const isOpenDelayedRef = useRef(true)
  const skipDelayTimerRef = useRef(0)
  const closeOpenRef = useRef<(() => void) | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(skipDelayTimerRef.current), [])

  const value = useMemo<Provider>(
    () => ({
      delayDuration,
      disableHoverableContent,
      isOpenDelayedRef,
      noteOpen: (close) => {
        const previous = closeOpenRef.current
        closeOpenRef.current = close
        if (previous && previous !== close) previous()
        if (skipDelayDuration <= 0) return
        window.clearTimeout(skipDelayTimerRef.current)
        isOpenDelayedRef.current = false
      },
      noteClose: (close) => {
        if (closeOpenRef.current === close) closeOpenRef.current = undefined
        if (skipDelayDuration <= 0) return
        window.clearTimeout(skipDelayTimerRef.current)
        skipDelayTimerRef.current = window.setTimeout(() => {
          isOpenDelayedRef.current = true
        }, skipDelayDuration)
      },
    }),
    [delayDuration, skipDelayDuration, disableHoverableContent],
  )

  return <ProviderContext value={value}>{children}</ProviderContext>
}

export type TooltipController = {
  open: boolean
  /** Open, or still playing its closing animation. */
  isPresent: boolean
  stateAttribute: 'closed' | 'delayed-open' | 'instant-open'
  disableHoverableContent: boolean
  triggerRef: React.RefObject<HTMLButtonElement | null>
  setOpen: (open: boolean) => void
  openNow: () => void
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onExitComplete: () => void
}

export function useTooltipController(options: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  disableHoverableContent?: boolean
}): TooltipController {
  const provider = useContext(ProviderContext)
  if (!provider) throw new Error('Tooltip must be used within TooltipProvider')

  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    !!options.defaultOpen,
  )
  const open = options.open ?? uncontrolledOpen
  const [isPresent, setIsPresent] = useState(open)
  if (open && !isPresent) setIsPresent(true)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const openTimerRef = useRef(0)
  const wasOpenDelayedRef = useRef(false)
  // The handlers below outlive a render: the provider holds `close` of the
  // open tooltip, and the timer fires later. They read the latest render.
  const latest = useRef({ open, options, provider })
  latest.current = { open, options, provider }

  const [handlers] = useState(() => {
    const clearTimer = () => {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = 0
    }
    const setOpen = (next: boolean) => {
      const { open, options, provider } = latest.current
      if (!next) clearTimer()
      if (next === open) return
      if (options.open === undefined) setUncontrolledOpen(next)
      if (next) provider.noteOpen(close)
      else provider.noteClose(close)
      options.onOpenChange?.(next)
    }
    const close = () => setOpen(false)
    const openNow = () => {
      clearTimer()
      wasOpenDelayedRef.current = false
      setOpen(true)
    }
    return {
      setOpen,
      openNow,
      onTriggerEnter: () => {
        const { options, provider } = latest.current
        if (!provider.isOpenDelayedRef.current) return openNow()
        clearTimer()
        openTimerRef.current = window.setTimeout(() => {
          openTimerRef.current = 0
          wasOpenDelayedRef.current = true
          setOpen(true)
        }, options.delayDuration ?? provider.delayDuration)
      },
      onTriggerLeave: () => {
        // A hoverable popup stays open while the pointer crosses to it
        if (isHoverableDisabled(latest.current)) close()
        else clearTimer()
      },
      onExitComplete: () => {
        if (!latest.current.open) setIsPresent(false)
      },
    }
  })
  useEffect(() => () => window.clearTimeout(openTimerRef.current), [])

  return {
    ...handlers,
    open,
    isPresent,
    stateAttribute: open
      ? wasOpenDelayedRef.current
        ? 'delayed-open'
        : 'instant-open'
      : 'closed',
    disableHoverableContent: isHoverableDisabled({ options, provider }),
    triggerRef,
  }
}

function isHoverableDisabled({
  options,
  provider,
}: {
  options: { disableHoverableContent?: boolean }
  provider: Provider
}) {
  return options.disableHoverableContent ?? provider.disableHoverableContent
}
