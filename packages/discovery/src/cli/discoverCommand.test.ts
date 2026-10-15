import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { discover } from './discoverCommand'

describe(discover.name, () => {
  it('refuses --ai and --ai-revisit with --dry-run, which never reaches the templatizer', async () => {
    for (const flags of [{ ai: true }, { aiRevisit: true }]) {
      await expect(
        discover(
          { project: 'p', overwriteCache: false, dryRun: true, ...flags },
          [],
          Logger.SILENT,
        ),
      ).toBeRejectedWith('--ai and --ai-revisit do not work with --dry-run')
    }
  })
})
