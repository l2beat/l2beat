import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { usePanelStore } from '../store/store'
import { ClosedSearch } from './ClosedSearch'
import { OpenSearch } from './OpenSearch'
import { useSearchStore } from './store'

export function Search() {
  const { setOpen, opened } = useSearchStore()
  const { project } = useParams()
  const { select } = usePanelStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (opened) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      // Focus the input when opened
      inputRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [opened, setOpen])

  return (
    <div className="relative" ref={containerRef}>
      {!opened ? (
        <ClosedSearch onClick={() => setOpen(true)} />
      ) : (
        <OpenSearch inputRef={inputRef} project={project} select={select} />
      )}
    </div>
  )
}
