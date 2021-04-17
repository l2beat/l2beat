import { exec, execSync } from 'child_process'
import { existsSync,mkdirSync } from 'fs'
import { join } from 'path'

import { generateImage } from '../utils/getOgImage'
import { getProjectsNames } from '../utils/getProjectsPaths'

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(() => resolve(undefined), time))
}

// async function wait(attempts = 10) {
//     let attempt = 0
//     while (attempt < attempts) {
//         try {
//             console.log(`Checking server: attempt ${attempt + 1}`)
//             const response = await axios.get("http://localhost:3000")
//             if (response.status === 200) {
//                 console.log('Server responded with 200')
//                 return;
//             }
//             console.log(`Server responded with ${response.status}`)
//         } catch {

//         }
//         attempt = attempt + 1
//         await sleep(3000)
//     }
//     throw new Error(`Couldn't connect to server!`)
// }

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
    clearAndCreateDirectory()
    console.log('Waiting for server')
    // await wait(20)
    await sleep(30000)

    console.log('Generating: overview')
    await generateImage()
    await Promise.all(getProjectsNames().map(async (project) => {
        console.log(`Generating: ${project}`)
        return generateImage(project)
    }))
    exec('killall node')
    console.log("FINISHED")
})()