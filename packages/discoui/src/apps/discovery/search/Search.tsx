import { useRef } from 'react'
import { useParams } from 'react-router'
import { Dialog } from '../../../components/Dialog'
import { usePanelStore } from '../store/panel-store'
import { ClosedSearch } from './ClosedSearch'
import { OpenSearch } from './OpenSearch'
import { useSearchStore } from './store'

export function Search() {
  const opened = useSearchStore((state) => state.opened)
  const setOpen = useSearchStore((state) => state.setOpen)
  const { project } = useParams()
  const select = usePanelStore((state) => state.select)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

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
        className="h-[400px] max-w-[600px] overflow-hidden rounded-md border-coffee-500 bg-coffee-900 p-0 shadow-2xl"
      >
        <Dialog.Title className="sr-only">Search</Dialog.Title>
        <OpenSearch inputRef={inputRef} project={project} select={select} />
      </Dialog.Body>
    </Dialog.Root>
  )
}
