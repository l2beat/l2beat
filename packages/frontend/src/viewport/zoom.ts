export type ZoomSource = 'wheel' | 'touch' | 'dblclick'
export type OnZoom = (
  delta: number,
  ox: number,
  oy: number,
  type: ZoomSource,
) => void

export class Zoom {
  el: HTMLElement
  intensity: number
  onzoom: OnZoom
  previous: { cx: number; cy: number; distance: number } | null = null

  pointers: PointerEvent[] = []

  destroy: () => void

  constructor(
    container: HTMLElement,
    el: HTMLElement,
    intensity: number,
    onzoom: OnZoom,
  ) {
    this.el = el
    this.intensity = intensity
    this.onzoom = onzoom

    const wheel = this.wheel.bind(this)
    const down = this.down.bind(this)
    const dblclick = this.dblclick.bind(this)
    const move = this.move.bind(this)
    const end = this.end.bind(this)

    container.addEventListener('wheel', wheel)
    container.addEventListener('pointerdown', down)
    container.addEventListener('dblclick', dblclick)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)

    this.destroy = () => {
      container.removeEventListener('wheel', wheel)
      container.removeEventListener('pointerdown', down)
      container.removeEventListener('dblclick', dblclick)

      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }

  get translating() {
    // is translating while zoom (works on multitouch)
    return this.pointers.length >= 2
  }

  wheel(e: WheelEvent) {
    e.preventDefault()

    const rect = this.el.getBoundingClientRect()
    const isNegative = e.deltaY < 0
    const delta = isNegative ? this.intensity : -this.intensity
    const ox = (rect.left - e.clientX) * delta
    const oy = (rect.top - e.clientY) * delta

    this.onzoom(delta, ox, oy, 'wheel')
  }

  touches() {
    const e = { touches: this.pointers }
    const [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY]
    const [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY]

    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

    return {
      cx: (x1 + x2) / 2,
      cy: (y1 + y2) / 2,
      distance,
    }
  }

  down(e: PointerEvent) {
    this.pointers.push(e)
  }

  move(e: PointerEvent) {
    this.pointers = this.pointers.map((p) =>
      p.pointerId === e.pointerId ? e : p,
    )
    if (!this.translating) return

    const rect = this.el.getBoundingClientRect()

    const { cx, cy, distance } = this.touches()

    if (this.previous !== null) {
      const delta = distance / this.previous.distance - 1

      const ox = (rect.left - cx) * delta
      const oy = (rect.top - cy) * delta

      this.onzoom(
        delta,
        ox - (this.previous.cx - cx),
        oy - (this.previous.cy - cy),
        'touch',
      )
    }
    this.previous = { cx, cy, distance }
  }

  end(e: PointerEvent) {
    this.previous = null
    this.pointers = this.pointers.filter((p) => p.pointerId !== e.pointerId)
  }

  dblclick(e: MouseEvent) {
    e.preventDefault()

    const rect = this.el.getBoundingClientRect()
    const delta = 4 * this.intensity

    const ox = (rect.left - e.clientX) * delta
    const oy = (rect.top - e.clientY) * delta

    this.onzoom(delta, ox, oy, 'dblclick')
  }
}
