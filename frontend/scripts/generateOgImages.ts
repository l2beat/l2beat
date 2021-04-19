import { execSync, spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

import { OG_FILES_DIR } from '../utils/constants'
import { generateImage } from '../utils/getOgImage'
import { getProjects } from '../utils/getProjects'

async function sleep(time: number) {
  console.log('Waiting for server')
  return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

function clearOrCreateDirectory() {
  if (existsSync(OG_FILES_DIR)) {
    console.log('Cleaning directory')
    execSync(`rm -rf ${OG_FILES_DIR}`)
  }
  console.log('Creating directory')
  mkdirSync(OG_FILES_DIR, { recursive: true })
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

  clearOrCreateDirectory()
  await sleep(2000)
  await generateImage()
  await Promise.all(getProjects().map(async (project) => generateImage(project)))

  serverProcess.kill()
  console.log('FINISHED')
  process.exit(0)
})()
