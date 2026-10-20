import { useEffect, useRef, useState } from 'react'
import { getDefinition, getReferences } from '../../../api/api'
import type {
  ApiDefinitionResponse,
  ApiReferencesResponse,
} from '../../../api/types'
import { GoToDefinitionPlugin } from '../../../components/editor/code/plugins/goToDefinition'
import { useCodeStore } from '../../../components/editor/store'
import { useDockingStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'

export interface CodeLocation {
  address: string
  sourceIndex: number
  offset: number
  length: number
}

export type DefinitionLookup =
  | { status: 'definitions'; response: ApiDefinitionResponse }
  | { status: 'references'; response: ApiReferencesResponse }
  | { status: 'failed' }

export function useGoToDefinition(
  editorId: string,
  project: string,
  address: string | undefined,
  sourceIndex: number | undefined,
) {
  const editor = useCodeStore((state) => state.editors[editorId])
  const { setSourceIndex, showRange } = useCodeStore()
  const select = usePanelStore((state) => state.select)
  const ensureLeaf = useDockingStore((state) => state.ensureLeaf)
  const history = useRef<CodeLocation[]>([])
  // A later lookup replaces an earlier one still in flight.
  const latestLookup = useRef(0)
  const [lookup, setLookup] = useState<DefinitionLookup | undefined>()

  const plugin = editor?.getPlugin(GoToDefinitionPlugin)

  const open = (location: CodeLocation) => {
    ensureLeaf('code')
    select([location.address])
    setSourceIndex(location.address, location.sourceIndex)
    showRange(location.address, {
      startOffset: location.offset,
      length: location.length,
    })
  }

  // References stay listed so several can be visited one after another.
  const navigate = (target: CodeLocation, keepOpen = false) => {
    const offset = plugin?.cursorOffset()
    if (address !== undefined && sourceIndex !== undefined && offset) {
      history.current.push({ address, sourceIndex, offset, length: 0 })
    }
    if (!keepOpen) {
      setLookup(undefined)
    }
    open(target)
  }

  useEffect(() => {
    if (plugin === undefined) {
      return
    }
    const run = <T>(
      request: () => Promise<T>,
      onResponse: (response: T) => void,
    ) => {
      const lookupId = ++latestLookup.current
      request().then(
        (response) => {
          if (lookupId === latestLookup.current) {
            onResponse(response)
          }
        },
        () => {
          if (lookupId === latestLookup.current) {
            setLookup({ status: 'failed' })
          }
        },
      )
    }
    plugin.setHandlers({
      goToDefinition: (offset) => {
        if (address === undefined || sourceIndex === undefined) {
          return
        }
        run(
          () => getDefinition(project, address, sourceIndex, offset),
          (response) => {
            const [only, ...rest] = response.definitions
            if (only !== undefined && rest.length === 0) {
              navigate(only)
            } else {
              setLookup({ status: 'definitions', response })
            }
          },
        )
      },
      findReferences: (offset) => {
        if (address === undefined || sourceIndex === undefined) {
          return
        }
        run(
          () => getReferences(project, address, sourceIndex, offset),
          (response) => setLookup({ status: 'references', response }),
        )
      },
      goBack: () => {
        const previous = history.current.pop()
        if (previous !== undefined) {
          open(previous)
        }
      },
    })
    return () => {
      plugin.setHandlers(undefined)
      latestLookup.current++
    }
  }, [plugin, project, address, sourceIndex])

  return { lookup, navigate, dismiss: () => setLookup(undefined) }
}
