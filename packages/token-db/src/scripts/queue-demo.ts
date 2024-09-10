import { nanoid } from 'nanoid'

setInterval(async () => {
  const id = nanoid()
  console.log(`Event ${id} scheduled`)
  await processEvent(id)
  console.log(`Event ${id} processed`)
}, 10)

let array: { event: string; resolve: () => void }[] | undefined = undefined

function processEvent(event: string) {
  return new Promise<void>((resolve) => {
    const entry = { event, resolve }
    if (!array) {
      array = [entry]
      setTimeout(() => {
        console.log('Processing batch of events ' + array?.length)
        array?.forEach((entry) => entry.resolve())
        array = undefined
      }, 10000)
    } else {
      array.push(entry)
    }
  })
}
