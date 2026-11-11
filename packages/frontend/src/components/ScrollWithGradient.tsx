import { cn } from '~/utils/cn'

export function ScrollWithGradient({
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('overflow-y-auto', className)}
      ref={(node) => {
        // Forward ref to parent
        if (ref) {
          if (typeof ref === 'function') ref(node)
          else ref.current = node
        }

        return trackScrollFades(node)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Fades the edges of a scrolling box that have more content past them, so a
 * row cut by the edge reads as "more below" rather than as a rendering bug.
 * Returns the cleanup, to return from a ref callback.
 */
export function trackScrollFades(node: HTMLElement | null) {
  if (!node) return
  const update = () => updateFades(node)

  node.addEventListener('scroll', update)
  // observe() delivers an initial notification once layout is settled,
  // which covers the first fade update. Reading scroll metrics here
  // instead would force a layout in the middle of React's commit.
  const resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(node)

  for (const child of node.children) {
    child.addEventListener('transitionend', update)
    // A box of fixed height overflows when its content grows, not itself.
    resizeObserver.observe(child)
  }

  return () => {
    node.removeEventListener('scroll', update)
    resizeObserver.disconnect()
    for (const child of node.children) {
      child.removeEventListener('transitionend', update)
    }
  }
}

function updateFades(node: HTMLElement) {
  const { scrollTop, scrollHeight, clientHeight } = node

  const isScrolledToTop = scrollTop === 0
  const isScrolledToBottom =
    Math.round(scrollTop + clientHeight) >= scrollHeight
  if (isScrolledToTop && isScrolledToBottom) {
    // Content that shrank to fit must not keep a fade over its last rows.
    node.classList.remove(
      'fade-out-vertical-12',
      'fade-out-to-bottom-12',
      'fade-out-to-top-12',
    )
    return
  }

  if (!isScrolledToTop && !isScrolledToBottom) {
    node.classList.add('fade-out-vertical-12')
  } else {
    node.classList.remove('fade-out-vertical-12')
  }

  if (isScrolledToTop) {
    node.classList.add('fade-out-to-bottom-12')
  } else {
    node.classList.remove('fade-out-to-bottom-12')
  }

  if (isScrolledToBottom) {
    node.classList.add('fade-out-to-top-12')
  } else {
    node.classList.remove('fade-out-to-top-12')
  }
}
