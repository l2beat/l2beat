import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { HighlightedText } from '../common/HighlightedText'
import { useSearchStore } from './store'

export function ProjectSearchResultEntry({ entries }: { entries: string[] }) {
  const { setOpen, searchTerm, selectedIndex } = useSearchStore()
  const navigate = useNavigate()

  const projectSearchTerm = getProjectSearchTerm(searchTerm)
  return (
    <ul>
      {entries.map((entry, index) => (
        <li
          key={index}
          data-index={index}
          className={clsx(
            'flex cursor-pointer items-center gap-2 border-coffee-700 border-b p-1 px-2 text-sm',
            index === selectedIndex
              ? 'bg-coffee-700 text-autumn-300'
              : 'text-coffee-200 hover:bg-coffee-700',
          )}
          onClick={() => {
            navigate(`/ui/p/${entry}`)
            setOpen(false)
          }}
        >
          <span className="max-w-[25rem] truncate font-medium">
            <HighlightedText text={entry} run={projectSearchTerm} />
          </span>
        </li>
      ))}
    </ul>
  )
}

export function isProjectSearchTerm(searchTerm: string): boolean {
  return searchTerm.startsWith('@')
}

export function getProjectSearchTerm(searchTerm: string): string {
  return searchTerm.slice(1)
}
