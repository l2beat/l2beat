export class Drag {
  pointerStart: [number, number] | null
  el: HTMLElement

  destroy: () => void

  constructor(
    el: HTMLElement,
    private readonly onDrag = (_x: number, _y: number, _e: PointerEvent) => {},
    private readonly onStart = (_e: PointerEvent) => {},
    private readonly onEnd = (_e: PointerEvent) => {},
  ) {
    this.pointerStart = null
    this.el = el

    this.el.style.touchAction = 'none'

    const down = this.down.bind(this)
    const move = this.move.bind(this)
    const up = this.up.bind(this)

    this.el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)

    this.destroy = () => {
      this.el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }

  down(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.stopPropagation()
    this.pointerStart = [e.pageX, e.pageY]

    this.onStart(e)
  }

  move(e: PointerEvent) {
    if (!this.pointerStart) return
    e.preventDefault()

    const [x, y] = [e.pageX, e.pageY]

    const delta = [x - this.pointerStart[0], y - this.pointerStart[1]]

    const zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth

    this.onDrag(delta[0] / zoom, delta[1] / zoom, e)
  }

  up(e: PointerEvent) {
    if (!this.pointerStart) return

    this.pointerStart = null
    this.onEnd(e)
  }
}
