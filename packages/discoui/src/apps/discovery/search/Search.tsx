import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Dialog } from '../../../components/Dialog'
import { ClosedSearch } from './ClosedSearch'
import { OpenSearch } from './OpenSearch'
import { useSearchStore } from './store'

export function Search() {
  const opened = useSearchStore((state) => state.opened)
  const setOpen = useSearchStore((state) => state.setOpen)
  const { project } = useParams()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!useSearchStore.getState().opened)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  return (
    <Dialog.Root
      modal={false}
      open={opened}
      onOpenChange={(open) => setOpen(open)}
    >
      <Dialog.Trigger>
        <ClosedSearch />
      </Dialog.Trigger>
      <Dialog.Body
        nonModal
        noCloseButton
        className="top-[12vh] h-[min(480px,72vh)] max-w-[680px] translate-y-0 overflow-hidden rounded-md border-coffee-500 bg-coffee-900 p-0 shadow-2xl"
      >
        <Dialog.Title className="sr-only">Search</Dialog.Title>
        <OpenSearch project={project} />
      </Dialog.Body>
    </Dialog.Root>
  )
}
