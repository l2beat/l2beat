'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentPropsWithRef } from 'react'

export function LinkWithOnHoverPrefetch(
  props: Omit<ComponentPropsWithRef<typeof Link>, 'prefetch'>,
) {
  const router = useRouter()

  const href = typeof props.href === 'string' ? props.href : props.href.href
  const prefetch = () => {
    if (!href) return
    router.prefetch(href)
  }

  return (
    <Link
      {...props}
      prefetch={false}
      onMouseEnter={(event) => {
        prefetch()
        props.onMouseEnter?.(event)
      }}
      onPointerEnter={(e) => {
        prefetch()
        return props.onPointerEnter?.(e)
      }}
      onTouchStart={(e) => {
        prefetch()
        return props.onTouchStart?.(e)
      }}
      onFocus={(e) => {
        prefetch()
        return props.onFocus?.(e)
      }}
    />
  )
}
