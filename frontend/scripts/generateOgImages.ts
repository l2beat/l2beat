import { generateImage } from '../utils/getOgImage'
import { getProjectsNames } from '../utils/getProjectsPaths'
import { exec, execSync } from 'child_process'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

function createDirectory() {
    const ogPath = join(process.cwd(), 'public', 'og')
    if (existsSync(ogPath)) {
        console.log('Cleaning directory')
        execSync(`rm -rf ${join(process.cwd(), 'public', 'og')}`)
    }
    console.log('Creating directory')
    mkdirSync(ogPath)

}
(async () => {
    const serverProcess = exec('yarn dev')
    console.log('Starting server')
    serverProcess.addListener('', console.log)
    createDirectory()

    await sleep(20000)

    console.log('Generating: overview')
    await generateImage()
    await Promise.all(getProjectsNames().map(async (project) => {
        console.log(`Generating: ${project}`)
        generateImage(project)
    }))


    serverProcess.kill()
    await sleep(20000)
})()