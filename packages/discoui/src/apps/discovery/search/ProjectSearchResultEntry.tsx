import { useNavigate } from 'react-router'
import { cn } from '../../../utils/cn'
import { HighlightedText } from './HighlightedText'
import { useSearchStore } from './store'

export function ProjectSearchResultEntry({ entries }: { entries: string[] }) {
  const setOpen = useSearchStore((state) => state.setOpen)
  const searchTerm = useSearchStore((state) => state.searchTerm)
  const selectedIndex = useSearchStore((state) => state.selectedIndex)
  const navigate = useNavigate()

  const projectSearchTerm = getProjectSearchTerm(searchTerm)
  return (
    <ul>
      {entries.map((entry, index) => (
        <li
          key={index}
          data-index={index}
          className={cn(
            'flex min-h-[29px] cursor-pointer items-center border-coffee-800 border-b px-3 text-[13px] text-coffee-200',
            index === selectedIndex
              ? 'bg-coffee-700 shadow-[inset_2px_0_0_#BAD80A]'
              : 'hover:bg-coffee-800',
          )}
          onClick={() => {
            void navigate(`/ui/p/${entry}`)
            setOpen(false)
          }}
        >
          <span className="min-w-0 truncate font-medium">
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
