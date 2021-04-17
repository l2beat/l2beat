import { exec, execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { generateImage } from '../utils/getOgImage'
import { getProjectsNames } from '../utils/getProjectsPaths'

async function sleep(time: number) {
    console.log('Waiting for server')
    return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

function clearAndCreateDirectory() {
    const ogPath = join(process.cwd(), 'public', 'og')
    if (existsSync(ogPath)) {
        console.log('Cleaning directory')
        execSync(`rm -rf ${join(process.cwd(), 'public', 'og')}`)
    }
    console.log('Creating directory')
    mkdirSync(ogPath)

}
(async () => {
    const yarnProcess = exec('yarn dev')
    clearAndCreateDirectory()
    await sleep(30000)
    await generateImage()
    const _ = await Promise.all(getProjectsNames().map(async (project) => generateImage(project)))
    yarnProcess.kill()
    console.log("FINISHED")
})()