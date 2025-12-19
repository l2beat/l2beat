import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog } from '../../../components/Dialog'
import { usePanelStore } from '../store/panel-store'
import { ClosedSearch } from './ClosedSearch'
import { OpenSearch } from './OpenSearch'
import { useSearchStore } from './store'

export function Search() {
  const { setOpen, opened } = useSearchStore()
  const { project } = useParams()
  const { select } = usePanelStore()
  const inputRef = useRef<HTMLInputElement>(null)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  return (
    <Dialog.Root open={opened} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger>
        <ClosedSearch />
      </Dialog.Trigger>
      <Dialog.Body
        noCloseButton
        className="h-[400px] rounded bg-coffee-800 p-0"
      >
        <Dialog.Title className="sr-only">Search</Dialog.Title>
        <OpenSearch inputRef={inputRef} project={project} select={select} />
      </Dialog.Body>
    </Dialog.Root>
  )
}
