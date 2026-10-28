import {
  getDiscoveryPaths,
  readWatchedFile,
  WATCHED_FILE,
} from '@l2beat/discovery'
import { assert, type json } from '@l2beat/shared-pure'
import { join } from 'path'

// Reads the committed watched.json of a project, the way ProjectDiscovery
// reads discovered.json, so project files can use watched values.
export class ProjectWatch {
  private readonly values: Record<string, json>

  constructor(
    public readonly projectName: string,
    projectsPath = getDiscoveryPaths().discovery,
  ) {
    const watched = readWatchedFile(
      join(projectsPath, projectName, WATCHED_FILE),
    )
    assert(watched !== undefined, 'Project has no watched.json', {
      projectName,
    })
    this.values = watched.values
  }

  getValue<T>(key: string): T {
    const value = this.values[key]
    assert(value !== undefined, 'Watched value not found', {
      projectName: this.projectName,
      key,
    })
    return value as T
  }
}
