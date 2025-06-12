import { exec } from 'child_process'

type PreviewManagerDependencies = {
  app: string
}
export class PreviewManager {
  constructor(private readonly dependencies: PreviewManagerDependencies) {}

  async start(id: number) {
    await execShellCommand(
      `cat envsubst-template.yaml | PR_ID=${id} ENV=prod envsubst | kubectl apply -n preview-prod -f -`,
    )
    await execShellCommand(
      `cat envsubst-template.yaml | PR_ID=${id} ENV=stage envsubst | kubectl apply -n preview-stage -f -`,
    )
  }

  //   async findById(id: number) {
  //     const pods = await execShellCommand(
  //       `kubectl get pods -n preview-prod -l app=${this.dependencies.app},pr=${id}`,
  //     )

  //     const podStatus = JSON.parse(pods) as PodStatusRaw

  //     return podStatus
  //   }
}

async function execShellCommand<T extends string = string>(command: string) {
  return new Promise<T>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log('stdout', stdout)
      console.log('stderr', stderr)
      console.log('error', error)
      if (error || stderr) {
        reject(error || stderr)
      }
      resolve(stdout as T)
    })
  })
}
