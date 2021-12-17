import fetch from 'node-fetch'

interface FourBytesResult {
  count: number
  results: {
    id: number
    text_signature: string
  }[]
}

export class FourBytesApi {
  methodCache = new Map()

  //constructor() {
  //  this.methodCache = new Map();
  // }

  async getMethodName(hexSig: string) {
    if (hexSig.length != 10) return undefined
    let methodName = this.methodCache.get(hexSig)
    if (methodName) return methodName

    // gets method name from 4Bytes
    const url =
      'https://www.4byte.directory/api/v1/signatures/?hex_signature=' + hexSig

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = (await res.json()) as FourBytesResult
    if (json.count != 0) {
      if (json.results[0].text_signature == '') {
        methodName = 'Unknown'
      } else {
        let minIndex = 0
        let minId = json.results[0].id
        // grabbing name with the lowest id
        for (let i = 1; i < json.count; i++) {
          if (json.results[i].id < minId) {
            minId = json.results[i].id
            minIndex = i
          }
        }
        methodName = json.results[minIndex].text_signature
        this.methodCache.set(hexSig, methodName)
      }
    }
    return methodName
  }
}
