import { Drag } from './drag'
import { Zoom, ZoomSource } from './zoom'

export interface Transform {
  k: number
  x: number
  y: number
}
export interface Mouse {
  x: number
  y: number
}

export class Area {
  el: HTMLElement
  container: HTMLElement
  transform: Transform = { k: 1, x: 0, y: 0 }
  mouse: Mouse = { x: 0, y: 0 }

  private _startPosition: Transform | null = null
  private readonly _zoom: Zoom
  private readonly _drag: Drag

  private readonly onChangeTransform: (transform: string) => void

  destroy: () => void

  constructor(
    container: HTMLElement,
    el: HTMLElement,
    onChangeTransform: (transform: string) => void,
  ) {
    this.el = el
    this.onChangeTransform = onChangeTransform

    this.container = container
    // el.style.transformOrigin = "0 0";

    this._zoom = new Zoom(container, el, 0.1, this.onZoom.bind(this))
    this._drag = new Drag(
      container,
      this.onTranslate.bind(this),
      this.onStart.bind(this),
    )

    const pointermove = this.pointermove.bind(this)
    this.container.addEventListener('pointermove', pointermove)

    this.destroy = () => {
      this.container.removeEventListener('pointermove', pointermove)
      this._zoom.destroy()
      this._drag.destroy()
    }
  }

  update() {
    const t = this.transform
    this.onChangeTransform(`translate(${t.x}px, ${t.y}px) scale(${t.k})`)
  }

  pointermove(e: PointerEvent) {
    const { clientX, clientY } = e
    const rect = this.el.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const k = this.transform.k

    this.mouse = { x: x / k, y: y / k }
  }

  onStart() {
    this._startPosition = { ...this.transform }
  }

  onTranslate(dx: number, dy: number) {
    if (this._zoom.translating) return // lock translation while zoom on multitouch
    if (this._startPosition)
      this.translate(this._startPosition.x + dx, this._startPosition.y + dy)
  }

  onZoom(delta: number, ox: number, oy: number, source: ZoomSource) {
    let newZoom = this.transform.k * (1 + delta)
    newZoom = Math.min(2, Math.max(0.5, newZoom))
    this.zoom(newZoom, ox, oy, source)

    this.update()
  }

  translate(x: number, y: number) {
    const params = { transform: this.transform, x, y }

    this.transform.x = params.x
    this.transform.y = params.y

    this.update()
  }

  zoom(zoom: number, ox = 0, oy = 0, source: ZoomSource) {
    const k = this.transform.k
    const params = { transform: this.transform, zoom, source }

    const d = (k - params.zoom) / (k - zoom || 1)

    this.transform.k = params.zoom || 1
    this.transform.x += ox * d
    this.transform.y += oy * d

    this.update()
  }
}
