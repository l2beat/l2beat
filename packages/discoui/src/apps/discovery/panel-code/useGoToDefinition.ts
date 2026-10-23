import { useEffect, useRef, useState } from 'react'
import { getContractAt, getDefinition, getReferences } from '../../../api/api'
import type {
  ApiContractAtResponse,
  ApiDefinitionResponse,
  ApiReferencesResponse,
} from '../../../api/types'
import {
  type DefinitionRequest,
  GoToDefinitionPlugin,
} from '../../../components/editor/code/plugins/goToDefinition'
import type { PeekOrigin } from '../../../components/editor/code/plugins/peek'
import { useCodeStore } from '../../../components/editor/store'
import { useDockingStore } from '../multi-view/store'
import { useGlobalSettingsStore } from '../store/global-settings-store'
import { usePanelStore } from '../store/panel-store'
import { peekContent } from './lookupRows'

export interface CodeLocation {
  address: string
  sourceIndex: number
  offset: number
  length: number
}

export type DefinitionLookup =
  | { status: 'definitions'; response: ApiDefinitionResponse }
  | { status: 'references'; response: ApiReferencesResponse }
  | { status: 'contract'; response: ApiContractAtResponse }
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
  const peekDefinitions = useGlobalSettingsStore((s) => s.peekDefinitions)

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

  const rememberCursor = () => {
    const offset = plugin?.cursorOffset()
    if (
      address !== undefined &&
      sourceIndex !== undefined &&
      offset !== undefined
    ) {
      history.current.push({ address, sourceIndex, offset, length: 0 })
    }
  }

  // References stay listed so several can be visited one after another.
  const navigate = (target: CodeLocation, keepOpen = false) => {
    rememberCursor()
    if (!keepOpen) {
      setLookup(undefined)
    }
    open(target)
  }

  // A peek's position is in the file it shows, the panel's in its own file.
  const positionOf = ({
    origin,
    offset,
  }: DefinitionRequest): PeekOrigin | undefined => {
    if (origin !== undefined) {
      return { ...origin, offset: origin.offset + offset }
    }
    if (address === undefined || sourceIndex === undefined) {
      return undefined
    }
    return { address, sourceIndex, offset }
  }

  // Locations and listed results hold addresses of the previous project.
  useEffect(() => {
    history.current = []
    setLookup(undefined)
  }, [project])

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
      goToDefinition: (request) => {
        const at = positionOf(request)
        if (at === undefined) {
          return
        }
        run(
          () => getDefinition(project, at.address, at.sourceIndex, at.offset),
          (response) => {
            const [only, ...rest] = response.definitions
            if (only === undefined || rest.length > 0) {
              setLookup({ status: 'definitions', response })
            } else if (peekDefinitions) {
              setLookup(undefined)
              plugin.peek(
                request,
                peekContent(only, () => navigate(only)),
              )
            } else {
              navigate(only)
            }
          },
        )
      },
      goToContract: (request) => {
        const at = positionOf(request)
        if (at === undefined) {
          return
        }
        run(
          () => getContractAt(project, at.address, at.sourceIndex, at.offset),
          (response) => {
            if (response.address === undefined || response.name === undefined) {
              setLookup({ status: 'contract', response })
              return
            }
            rememberCursor()
            setLookup(undefined)
            ensureLeaf('code')
            select([response.address])
          },
        )
      },
      findReferences: (request) => {
        const at = positionOf(request)
        if (at === undefined) {
          return
        }
        run(
          () => getReferences(project, at.address, at.sourceIndex, at.offset),
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
  }, [plugin, project, address, sourceIndex, peekDefinitions])

  return { lookup, navigate, dismiss: () => setLookup(undefined) }
}
