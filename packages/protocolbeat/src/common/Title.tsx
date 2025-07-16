import { useEffect } from 'react'

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

export function Title({ title }: { title: string }) {
  useTitle(title)
  return null
}
