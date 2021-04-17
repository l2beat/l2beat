import { generateImage } from '../utils/getOgImage'
import { getProjectsNames } from '../utils/getProjectsPaths'
import { exec, execSync, spawn } from 'child_process'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import request from 'request'

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

async function wait(attempts = 10) {
    let attempt = 0
    while (attempt < attempts) {
        console.log(`Checking server: attempt ${attempt + 1}`)
        try {
            const response = await request.get('http://localhost:3000')
            if (response.response?.statusCode === 200) {
                console.log('Server responded')
                break;
            }
        } catch {

        }
        attempt = attempt + 1
        await sleep(3000)
    }
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
    const serverProcess = spawn(`${process.cwd()} yarn dev`)
    console.log('Starting server')
    createDirectory()

    // await wait()
    // await sleep(60000)

    // console.log('Generating: overview')
    // await generateImage()
    // getProjectsNames().map(async (project) => {
    //     console.log(`Generating: ${project}`)
    //     await generateImage(project)
    // })


    // console.log('Killing server')
    // serverProcess.kill()
    // await sleep(20000)
})()