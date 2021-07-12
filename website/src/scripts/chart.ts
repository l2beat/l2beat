import { ChartInput } from './ChartInput'
import { plot } from './plot'

export class Chart {
  private input?: string
  private period = 90
  private scale: 'lin' | 'log' = 'lin'

  private ctx: CanvasRenderingContext2D
  private data?: ChartInput

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = getContext(canvas)
    const input = canvas.dataset.input
    if (input) {
      delete canvas.dataset.input
      this.setInput(input)
    }
    this.listenOnResize()
  }

  setInput(value: string) {
    this.input = value

    fetch(value)
      .then((res) => res.json())
      .then((data) => {
        if (this.input === value) {
          this.data = data
          this.draw()
        }
      })
  }

  private listenOnResize() {
    window.addEventListener('resize', () =>
      requestAnimationFrame(() => this.draw())
    )
  }

  private draw() {
    if (!this.data) {
      return
    }
    plot(this.data, this.period, this.ctx)
  }
}

function getContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Cannot get canvas context!')
  }
  return ctx
}
