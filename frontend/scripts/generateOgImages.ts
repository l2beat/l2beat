import { spawn } from 'child_process'

import { generateImage } from '../utils/getOgImage'
import { getProjects } from '../utils/getProjects'

async function sleep(time: number) {
  console.log('Waiting for server')
  return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

void (async (): Promise<void> => {
  const serverProcess = spawn(`./node_modules/.bin/http-server`, ['./out'], { cwd: process.cwd() })

  serverProcess.stdout.on('data', function (data) {
    console.log(`stdout: ${data.toString()}`)
  })
  serverProcess.stderr.on('data', function (data) {
    console.log(`stderr: ${data.toString()}`)
  })
  serverProcess.on('exit', function (code) {
    console.log(`child process exited with code ${code?.toString()}`)
  })

  await sleep(2000)
  await generateImage('overview')
  await Promise.all(getProjects().map(async (project) => generateImage(project)))

  serverProcess.kill()
  console.log('FINISHED')
  process.exit(0)
})()
