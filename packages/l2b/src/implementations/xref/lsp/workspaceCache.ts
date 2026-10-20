import { join } from 'path'
import {
  type FlatLocation,
  type FlatWorkspace,
  locateFlat,
} from '../FlatWorkspace'

export interface LoadedWorkspace {
  workspace: FlatWorkspace
  stamp: string
  currentStamp: () => string
}

// A file reached from another project, like a shared module opened through go
// to definition, is answered by that project's workspace, so its callers stay
// in view. Any other file switches to its own project.
export function createWorkspaceCache(
  load: (location: FlatLocation) => LoadedWorkspace,
): (path: string) => FlatWorkspace | undefined {
  const cache = new Map<string, LoadedWorkspace>()
  let current: FlatLocation | undefined

  function workspaceOf(location: FlatLocation): FlatWorkspace {
    const key = join(location.projectsDirectory, location.project)
    const cached = cache.get(key)
    if (cached !== undefined && cached.stamp === cached.currentStamp()) {
      return cached.workspace
    }
    const loaded = load(location)
    cache.set(key, loaded)
    return loaded.workspace
  }

  return (path) => {
    const location = locateFlat(path)
    if (location === undefined) {
      return undefined
    }
    if (current !== undefined) {
      const workspace = workspaceOf(current)
      if (workspace.entryOfPath(path) !== undefined) {
        return workspace
      }
    }
    current = location
    return workspaceOf(location)
  }
}
