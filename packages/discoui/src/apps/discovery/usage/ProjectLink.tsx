import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePanelStore } from '../store/panel-store'

export function ProjectLink(props: {
  project: string
  selectAddress?: string
  title?: string
  className?: string
  children: ReactNode
}) {
  const select = usePanelStore((state) => state.select)
  const { selectAddress } = props

  return (
    <Link
      to={`/ui/p/${props.project}`}
      title={props.title}
      onClick={() => {
        if (selectAddress !== undefined) {
          select([selectAddress])
        }
      }}
      className={props.className}
    >
      {props.children}
    </Link>
  )
}
