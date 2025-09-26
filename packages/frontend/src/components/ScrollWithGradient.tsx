import { cn } from '~/utils/cn'

export function ScrollWithGradient({
  children,
  className,
}: React.ComponentProps<'div'>) {
  function updateFades(node: HTMLDivElement) {
    const { scrollTop, scrollHeight, clientHeight } = node

    const isScrolledToTop = scrollTop === 0
    const isScrolledToBottom = scrollTop + clientHeight === scrollHeight
    if (isScrolledToTop && isScrolledToBottom) return

    if (!isScrolledToTop && !isScrolledToBottom) {
      node.classList.add('fade-out-vertical-8')
    } else {
      node.classList.remove('fade-out-vertical-8')
    }

    if (isScrolledToTop) {
      node.classList.add('fade-out-to-bottom-8')
    } else {
      node.classList.remove('fade-out-to-bottom-8')
    }

    if (isScrolledToBottom) {
      node.classList.add('fade-out-to-top-8')
    } else {
      node.classList.remove('fade-out-to-top-8')
    }
  }
  return (
    <div
      className={cn('overflow-y-auto', className)}
      ref={(node) => {
        if (!node) return
        updateFades(node)
        node.addEventListener('scroll', () => {
          updateFades(node)
        })
      }}
    >
      {children}
    </div>
  )
}
