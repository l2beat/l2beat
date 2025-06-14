import { exec } from 'child_process'
import type { PodStatusRaw } from './types'

type PreviewManagerDependencies = {
  app: string
}

type PodStatus = {
  name: string
  id: number
  hash: string
  namespace: string
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

  async findById(id: number) {
    const commandProd = `kubectl get pods -n preview-prod -l app=${this.dependencies.app},pr=${id} -o json`
    const commandStage = `kubectl get pods -n preview-stage -l app=${this.dependencies.app},pr=${id} -o json`

    const podsProd = await execShellCommand(commandProd)
    const podsStage = await execShellCommand(commandStage)

    const podStatusProd = JSON.parse(podsProd) as PodStatusRaw
    const podStatusStage = JSON.parse(podsStage) as PodStatusRaw

    return {
      prod: rawToPodStatus(podStatusProd),
      stage: rawToPodStatus(podStatusStage),
    }
  }
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

function rawToPodStatus(raw: PodStatusRaw): PodStatus {
  const firstPod = raw.items[0]

  if (!firstPod) {
    throw new Error('No pod found')
  }

  return {
    id: Number(firstPod.metadata.labels.pr),
    name: firstPod.metadata.name,
    hash: firstPod.metadata.labels['pod-template-hash'],
    namespace: firstPod.metadata.namespace,
  }
}
