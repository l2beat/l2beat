import type { Logger } from '@l2beat/backend-tools'
import { exec } from 'child_process'

type InfrastructureControllerDependencies = {
  logger: Logger
}

export class InfrastructureController {
  constructor(
    private readonly dependencies: InfrastructureControllerDependencies,
  ) {}

  async handleFrontendPreview(prNumber: number) {
    await execShellCommand(
      `cat envsubst-template.yaml | PR_ID=${prNumber} envsubst | kubectl apply -n preview-prod -f`,
    )
  }
}

async function execShellCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr)
      }
      resolve(stdout)
    })
  })
}
