import { prepareCanvas } from '../../hooks'
import {
  BallBuffer,
  FIELD_THRESHOLD,
  type GooFrame,
  type GooRenderer,
  REACH_PER_RADIUS,
} from './goo'
import { getFragmentShader, VERTEX_SHADER } from './gooShader'
import type { Wave } from './wave'

/** Goo drawn with WebGL, or flat circles where WebGL cannot run */
export function createGooRenderer(container: HTMLElement): GooRenderer {
  try {
    return new WebGlGoo(container)
  } catch {
    return new CanvasGoo(container)
  }
}

/** CSS px a tile of the card covers. Each is drawn with only the balls over it */
const TILE = 64
// device px per CSS px, stepped down while frames come too slowly
const DENSITIES = [2, 1.5, 1.25, 1]
const CONTEXT: WebGLContextAttributes = {
  alpha: true,
  premultipliedAlpha: true,
  antialias: false,
  depth: false,
  stencil: false,
}

/**
 * The field is summed per pixel, so the cost is pixels × balls. The card is
 * cut into tiles and each tile sums only the balls that reach into it: the
 * empty air between the rail and the pool costs nothing.
 */
class WebGlGoo implements GooRenderer {
  private readonly canvas: HTMLCanvasElement
  private readonly gl: WebGLRenderingContext
  private gpu!: GpuState
  private width = 0
  private height = 0
  private densityStep = 0
  private tiles: number[][] = []
  private lost = false

  constructor(container: HTMLElement) {
    this.canvas = createCanvas(container)
    // a GPU emulated on the CPU, where every pixel counts four times over
    // at double density, starts at the lowest density
    const fast = this.canvas.getContext('webgl', {
      ...CONTEXT,
      failIfMajorPerformanceCaveat: true,
    })
    const gl = fast ?? this.canvas.getContext('webgl', CONTEXT)
    if (!gl) {
      this.canvas.remove()
      throw new Error('WebGL is not available')
    }
    this.gl = gl
    try {
      this.gpu = createGpuState(gl)
    } catch (error) {
      this.canvas.remove()
      throw error
    }
    this.canvas.addEventListener('webglcontextlost', this.onLost)
    this.canvas.addEventListener('webglcontextrestored', this.onRestored)
    const device = Math.max(window.devicePixelRatio || 1, 1)
    this.densityStep = fast
      ? Math.max(
          DENSITIES.findIndex((d) => d <= device),
          0,
        )
      : DENSITIES.length - 1
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    const density = this.density()
    this.canvas.width = Math.max(1, Math.round(width * density))
    this.canvas.height = Math.max(1, Math.round(height * density))
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
  }

  lowerDensity() {
    if (this.densityStep >= DENSITIES.length - 1) return false
    this.densityStep++
    this.resize(this.width, this.height)
    return true
  }

  render(frame: GooFrame) {
    const { gl, canvas } = this
    if (this.lost || this.width === 0) return
    const g = this.gpu
    const density = canvas.width / this.width

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.disable(gl.SCISSOR_TEST)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    bindProgram(gl, g)
    uploadWave(gl, g, frame.wave)
    setFrameUniforms(gl, g, frame, {
      canvasHeight: canvas.height,
      density,
      width: this.width,
      height: this.height,
    })

    const columns = Math.ceil(this.width / TILE)
    const rows = Math.ceil(this.height / TILE)
    this.binBalls(frame.balls, columns, rows)
    const poolStart =
      frame.poolTop - frame.wave.highestCrest() - frame.poolReach - 1
    const toDevice = (v: number) => Math.round(v * density)

    gl.enable(gl.SCISSOR_TEST)
    for (let row = 0; row < rows; row++) {
      const top = toDevice(row * TILE)
      const bottom = Math.min(
        toDevice(Math.min((row + 1) * TILE, this.height)),
        canvas.height,
      )
      const hasPool = (row + 1) * TILE > poolStart
      for (let column = 0; column < columns; column++) {
        const list = this.tiles[row * columns + column] ?? []
        if (list.length === 0 && !hasPool) continue
        const left = toDevice(column * TILE)
        const right = Math.min(
          toDevice(Math.min((column + 1) * TILE, this.width)),
          canvas.width,
        )
        const count = uploadBalls(gl, g, frame.balls, list)
        gl.uniform1i(g.uniforms.count, count)
        gl.uniform1f(g.uniforms.poolOn, hasPool ? 1 : 0)
        gl.scissor(left, canvas.height - bottom, right - left, bottom - top)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
    }
  }

  dispose() {
    this.canvas.removeEventListener('webglcontextlost', this.onLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored)
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
    this.canvas.remove()
  }

  private density() {
    const device = Math.max(window.devicePixelRatio || 1, 1)
    return Math.min(DENSITIES[this.densityStep] ?? 1, device)
  }

  private binBalls(balls: BallBuffer, columns: number, rows: number) {
    const total = columns * rows
    for (let i = 0; i < total; i++) {
      const list = this.tiles[i]
      if (list) list.length = 0
      else this.tiles[i] = []
    }
    const d = balls.data
    for (let i = 0; i < balls.count; i++) {
      const o = i * BallBuffer.STRIDE
      const x = d[o] ?? 0
      const y = d[o + 1] ?? 0
      const reach = d[o + 2] ?? 0
      const reachY = reach * (d[o + 3] ?? 1)
      const c0 = Math.max(Math.floor((x - reach) / TILE), 0)
      const c1 = Math.min(Math.floor((x + reach) / TILE), columns - 1)
      const r0 = Math.max(Math.floor((y - reachY) / TILE), 0)
      const r1 = Math.min(Math.floor((y + reachY) / TILE), rows - 1)
      for (let row = r0; row <= r1; row++) {
        for (let column = c0; column <= c1; column++) {
          this.tiles[row * columns + column]?.push(i)
        }
      }
    }
  }

  private onLost = (event: Event) => {
    event.preventDefault()
    this.lost = true
  }

  private onRestored = () => {
    try {
      this.gpu = createGpuState(this.gl)
      this.lost = false
    } catch {
      // stays blank rather than throwing inside an event handler
    }
  }
}

interface GpuState {
  program: WebGLProgram
  triangle: WebGLBuffer
  position: number
  wave: WebGLTexture
  waveColumns: number
  waveBytes: Uint8Array
  maxBalls: number
  ball: Float32Array
  tint: Float32Array
  look: Float32Array
  uniforms: Record<UniformName, WebGLUniformLocation | null>
}

const UNIFORM_NAMES = [
  'ball',
  'tint',
  'look',
  'count',
  'canvasHeight',
  'scale',
  'threshold',
  'bulge',
  'wave',
  'columns',
  'width',
  'poolOn',
  'poolTop',
  'poolDepth',
  'poolReach',
  'poolLip',
  'poolVessel',
  'poolCalm',
  'poolTint',
  'poolDeep',
  'poolLook',
  'light',
  'halfway',
  'shade',
  'rim',
  'specular',
  'sheen',
  'halo',
] as const
type UniformName = (typeof UNIFORM_NAMES)[number]

function createGpuState(gl: WebGLRenderingContext): GpuState {
  // three vectors a ball; small phones allow few, so tiles hold fewer
  const vectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) as number
  const maxBalls = Math.max(8, Math.min(48, Math.floor((vectors - 32) / 3)))
  const program = linkProgram(gl, getFragmentShader(maxBalls))

  const triangle = gl.createBuffer()
  const wave = gl.createTexture()
  if (!triangle || !wave) throw new Error('Could not create GPU buffers')
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  gl.bindTexture(gl.TEXTURE_2D, wave)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const uniforms = Object.fromEntries(
    UNIFORM_NAMES.map((name) => [
      name,
      gl.getUniformLocation(
        program,
        name === 'ball' || name === 'tint' || name === 'look'
          ? `u_${name}[0]`
          : `u_${name}`,
      ),
    ]),
  ) as GpuState['uniforms']

  return {
    program,
    triangle,
    position: gl.getAttribLocation(program, 'a_position'),
    wave,
    waveColumns: 0,
    waveBytes: new Uint8Array(0),
    maxBalls,
    ball: new Float32Array(maxBalls * 4),
    tint: new Float32Array(maxBalls * 4),
    look: new Float32Array(maxBalls * 4),
    uniforms,
  }
}

function linkProgram(gl: WebGLRenderingContext, fragmentSource: string) {
  const program = gl.createProgram()
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!program) throw new Error('Could not create a GPU program')
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'Could not link shaders')
  }
  return program
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create a shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'Could not compile a shader')
  }
  return shader
}

function bindProgram(gl: WebGLRenderingContext, g: GpuState) {
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's, not a React hook
  gl.useProgram(g.program)
  gl.bindBuffer(gl.ARRAY_BUFFER, g.triangle)
  gl.enableVertexAttribArray(g.position)
  gl.vertexAttribPointer(g.position, 2, gl.FLOAT, false, 0, 0)
}

function uploadWave(gl: WebGLRenderingContext, g: GpuState, wave: Wave) {
  const columns = wave.columns
  if (g.waveColumns !== columns) {
    g.waveColumns = columns
    g.waveBytes = new Uint8Array(columns * 4)
    gl.bindTexture(gl.TEXTURE_2D, g.wave)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      columns,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    )
  }
  const bytes = g.waveBytes
  for (let i = 0; i < columns; i++) {
    const height = wave.heights[i] ?? 0
    const value = Math.round(
      Math.min(Math.max((height + 64) / 128, 0), 1) * 65535,
    )
    bytes[i * 4] = value >> 8
    bytes[i * 4 + 1] = value & 255
  }
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, g.wave)
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    0,
    0,
    columns,
    1,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    bytes,
  )
}

function setFrameUniforms(
  gl: WebGLRenderingContext,
  g: GpuState,
  frame: GooFrame,
  size: {
    canvasHeight: number
    density: number
    width: number
    height: number
  },
) {
  const u = g.uniforms
  const { theme } = frame
  const [lx, ly, lz] = theme.light
  const halfway = normalize([lx, ly, lz + 1])
  gl.uniform1f(u.canvasHeight, size.canvasHeight)
  gl.uniform1f(u.scale, size.density)
  gl.uniform1f(u.threshold, FIELD_THRESHOLD)
  gl.uniform1f(u.bulge, theme.bulge)
  gl.uniform1i(u.wave, 0)
  gl.uniform1f(u.columns, frame.wave.columns)
  gl.uniform1f(u.width, size.width)
  gl.uniform1f(u.poolTop, frame.poolTop)
  // clear of the lit lip of the surface, the walls and the floor
  const margin = frame.poolLip + frame.poolCorner + 2
  gl.uniform4f(
    u.poolCalm,
    margin,
    size.width - margin,
    frame.poolTop + frame.wave.deepestTrough() + frame.poolLip + 2,
    size.height - frame.poolLip - 2,
  )
  gl.uniform1f(u.poolDepth, Math.max(size.height - frame.poolTop, 1))
  gl.uniform1f(u.poolReach, frame.poolReach)
  gl.uniform1f(u.poolLip, frame.poolLip)
  // inset half a pixel, so the walls' anti-aliased edge shows whole
  gl.uniform4f(
    u.poolVessel,
    0.5,
    size.width - 0.5,
    size.height - 0.5,
    frame.poolCorner,
  )
  gl.uniform4f(u.poolTint, ...theme.poolTop.lab, theme.poolTop.chroma)
  gl.uniform4f(u.poolDeep, ...theme.poolDeep.lab, theme.poolDeep.chroma)
  gl.uniform2f(u.poolLook, theme.poolOpacity, theme.poolSaturation)
  gl.uniform3f(u.light, lx, ly, lz)
  gl.uniform3f(u.halfway, ...halfway)
  gl.uniform1f(u.shade, theme.shade)
  gl.uniform1f(u.rim, theme.rim)
  gl.uniform1f(u.specular, theme.specular)
  gl.uniform1f(u.sheen, theme.sheen)
  gl.uniform1f(u.halo, theme.halo)
}

/** Copies the balls over a tile into the uniform arrays, the largest first when too many */
function uploadBalls(
  gl: WebGLRenderingContext,
  g: GpuState,
  balls: BallBuffer,
  list: number[],
) {
  if (list.length > g.maxBalls) {
    const d = balls.data
    const size = (i: number) =>
      (d[i * BallBuffer.STRIDE + 2] ?? 0) * (d[i * BallBuffer.STRIDE + 4] ?? 0)
    list.sort((a, b) => size(b) - size(a))
  }
  const count = Math.min(list.length, g.maxBalls)
  if (count === 0) return 0
  const d = balls.data
  for (let j = 0; j < count; j++) {
    const o = (list[j] ?? 0) * BallBuffer.STRIDE
    const reach = d[o + 2] ?? 1
    g.ball[j * 4] = d[o] ?? 0
    g.ball[j * 4 + 1] = d[o + 1] ?? 0
    g.ball[j * 4 + 2] = 1 / (reach * reach)
    g.ball[j * 4 + 3] = 1 / (d[o + 3] ?? 1)
    const a = d[o + 6] ?? 0
    const b = d[o + 7] ?? 0
    g.tint[j * 4] = d[o + 5] ?? 0
    g.tint[j * 4 + 1] = a
    g.tint[j * 4 + 2] = b
    g.tint[j * 4 + 3] = Math.hypot(a, b)
    g.look[j * 4] = d[o + 4] ?? 0
    g.look[j * 4 + 1] = d[o + 8] ?? 1
    g.look[j * 4 + 2] = d[o + 9] ?? 1
    g.look[j * 4 + 3] = d[o + 10] ?? 1
  }
  const u = g.uniforms
  gl.uniform4fv(u.ball, g.ball.subarray(0, count * 4))
  gl.uniform4fv(u.tint, g.tint.subarray(0, count * 4))
  gl.uniform4fv(u.look, g.look.subarray(0, count * 4))
  return count
}

/** Without WebGL: flat circles and a flat pool. Less goo, the same story */
class CanvasGoo implements GooRenderer {
  private readonly canvas: HTMLCanvasElement
  private width = 0
  private height = 0

  constructor(container: HTMLElement) {
    this.canvas = createCanvas(container)
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`
  }

  lowerDensity() {
    return false
  }

  render(frame: GooFrame) {
    const ctx = prepareCanvas(this.canvas, this.width, this.height)
    if (!ctx) return
    ctx.clearRect(0, 0, this.width, this.height)
    const { theme, wave, poolTop } = frame
    ctx.globalAlpha = theme.poolOpacity
    ctx.fillStyle = theme.poolTop.css
    ctx.beginPath()
    ctx.moveTo(0, this.height)
    const step = this.width / 96
    for (let x = 0; x <= this.width + step / 2; x += step) {
      ctx.lineTo(x, poolTop + wave.heightAt(x))
    }
    ctx.lineTo(this.width, this.height)
    ctx.closePath()
    ctx.fill()

    const d = frame.balls.data
    for (let i = 0; i < frame.balls.count; i++) {
      const o = i * BallBuffer.STRIDE
      const amplitude = d[o + 4] ?? 0
      if ((d[o + 10] ?? 1) < 0.5) continue
      const radius = ((d[o + 2] ?? 0) / REACH_PER_RADIUS) * Math.cbrt(amplitude)
      ctx.globalAlpha = (d[o + 8] ?? 1) * Math.min(amplitude * 2, 1)
      ctx.fillStyle = frame.balls.colors[i]?.css ?? theme.poolTop.css
      ctx.beginPath()
      ctx.ellipse(
        d[o] ?? 0,
        d[o + 1] ?? 0,
        radius,
        radius * (d[o + 3] ?? 1),
        0,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  dispose() {
    this.canvas.remove()
  }
}

function createCanvas(container: HTMLElement) {
  const canvas = document.createElement('canvas')
  canvas.className = 'absolute top-0 left-0 block'
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  return canvas
}

function normalize([x, y, z]: [number, number, number]): [
  number,
  number,
  number,
] {
  const length = Math.hypot(x, y, z) || 1
  return [x / length, y / length, z / length]
}
