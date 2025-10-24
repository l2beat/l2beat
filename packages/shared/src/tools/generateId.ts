import·{·randomInt·}·from·'crypto'
import·{·v4·as·uuidv4·}·from·'uuid'

export function generateId() {
  return uuidv4()
}

export function generateIntId() {
  return randomInt(1000)
}
