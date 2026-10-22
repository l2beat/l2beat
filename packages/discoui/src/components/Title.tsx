import { useTitle } from '../hooks/useTitle'

export function Title({ title }: { title: string }) {
  useTitle(title)
  return null
}
