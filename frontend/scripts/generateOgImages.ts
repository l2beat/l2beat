import { exec, execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { OG_FILES_DIR } from '../utils/constants'

import { generateImage } from '../utils/getOgImage'
import { getProjectsNames } from '../utils/getProjectsPaths'

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

// function packImages() {
//     console.log(`Packing images`)
//     execSync(`tar -zcvf ${join(ARTIFACTS_DIR, 'og.tar.gz')} ${OG_FILES_DIR}`)
//     execSync(`rm -rf ${OG_FILES_DIR}`)
// }
(async (): Promise<void> => {
    const yarnProcess = exec('yarn dev', (err, std) => console.log(err, std))
    clearOrCreateDirectory()
    await sleep(30000)
    await generateImage()
    await Promise.all(getProjectsNames().map(async (project) => generateImage(project)))
    yarnProcess.kill()

    // packImages()
    console.log("FINISHED")
    process.exit(0)
})()