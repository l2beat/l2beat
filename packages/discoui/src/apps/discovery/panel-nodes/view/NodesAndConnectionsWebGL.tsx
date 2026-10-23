import { type ComponentType, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ApiAddressType } from '../../../../api/types'
import { ADDRESS_ICON_COMPONENTS } from '../../../../components/AddressIcon'
import { IconInitial } from '../../../../icons/IconInitial'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from '../store/utils/constants'
import {
  buildRenderGraph,
  type GroupContainer,
  isFieldConnectionLive,
} from '../store/utils/renderGraph'
import { getRowLayout, type NodeRow } from '../store/utils/rows'
import { topLevelByDescendant } from '../store/utils/subnodes'
import { getColor } from './colors/colors'

// ============================================================================
// Constants
// ============================================================================

type RGBA = [number, number, number, number]

const COFFEE_600: RGBA = [0x59 / 255, 0x4c / 255, 0x43 / 255, 1]
const COFFEE_400: RGBA = [0xa9 / 255, 0x87 / 255, 0x63 / 255, 1]
const COFFEE_200: RGBA = [0xf0 / 255, 0xd8 / 255, 0xbd / 255, 1]
const GRID_DOT: RGBA = [0x3c / 255, 0x33 / 255, 0x2d / 255, 1]
const AUTUMN_300: RGBA = [0xba / 255, 0xd8 / 255, 0x0a / 255, 1]
const AUX_RED: RGBA = [0xfb / 255, 0x4a / 255, 0x35 / 255, 1]
const AUX_GREEN: RGBA = [0x9d / 255, 0xde / 255, 0x6c / 255, 1]
const AUX_ORANGE: RGBA = [0xfe / 255, 0x80 / 255, 0x19 / 255, 1]

const DIMMED_CONNECTION_COLOR = withAlpha(COFFEE_400, 0.3)
const GRAYED_CONNECTION_COLOR = withAlpha(COFFEE_200, 0.1)
const BLACK: RGBA = [0, 0, 0, 1]
// Transparent ring color: a plain fill.
const NO_RING: RGBA = [0, 0, 0, 0]

const HEADER_ICON_SIZE = 16
const ICON_VIEW_BOX = 16
const HEADER_PADDING = 8
const HEADER_ITEM_GAP = 4
const NODE_CORNER_RADIUS = 4
const FULL_HEIGHT_CORNER_RADIUS = 16
const GROUP_CORNER_RADIUS = 12
const DOT_RADIUS = 5
const FIELD_DOT_CELL = DOT_RADIUS * 2 * 2 // see comment in emitNodeDots
const SELECTION_OUTLINE_INSET = 2
const SELECTION_OUTLINE_WIDTH = 4
const GROUP_OUTLINE_INSET = 1
const GROUP_OUTLINE_WIDTH = 2
const CONTAINER_CORNER_RADIUS = 12
const CONTAINER_OUTLINE_WIDTH = 2
const CONTAINER_Z = 1
const OVERLAP_BORDER_WIDTH = 2

const HEADER_FONT: FontSpec = {
  weight: 500,
  size: 14,
  family: 'ui-sans-serif, system-ui, sans-serif',
}
const FIELD_FONT: FontSpec = {
  size: 12,
  family: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}
// Tailwind's text-xs line height.
const FOOTER_LINE_HEIGHT = 16
const FOOTER_FONT: FontSpec = {
  italic: true,
  size: 12,
  family: 'ui-sans-serif, system-ui, sans-serif',
}

const CONNECTION_SEGMENTS = 32
const GRID_DOT_RADIUS_PER_CELL = 0.05
const INITIAL_RING_WIDTH = 15
const CONNECTION_CONTROL_OFFSET = 50
const DASH_ON_WORLD = 5
const DASH_OFF_WORLD = 5
const PERIMETER_SAMPLES_PER_CORNER = 8

// Floats per instance for each pipeline.
const QUAD_STRIDE_F = 18 // pos.xy, size.xy, color.rgba, radii.xyzw, border, z, ring.rgba
const TEXT_STRIDE_F = 13 // pos.xy, size.xy, uv.xyzw, color.rgba, z
const LINE_STRIDE_F = 6 // pos.xy, color.rgba
const CONNECTION_STRIDE_F = 12 // from.xy, to.xy, controlX.xy, color.rgba, width, dashed
const CONNECTION_WIDTH = 2
const HIGHLIGHTED_CONNECTION_WIDTH = 3

// ============================================================================
// Types
// ============================================================================

interface FontSpec {
  weight?: number
  italic?: boolean
  size: number
  family: string
}

interface NodeFlags {
  isSelected: boolean
  isDimmed: boolean
  isGrayedOut: boolean
  isOverlapping: boolean
  fieldHighlighted: Uint8Array
  fieldTargetHidden: Uint8Array
}

interface DrawData {
  visible: Node[]
  visibleById: Map<string, Node>
  flags: Map<string, NodeFlags>
  containers: GroupContainer[]
  selectedContainers: Set<string>
  enableDimming: boolean
  markUnreachableEntries: boolean
  anyNodeSelected: boolean
  liveGroupTargets: ReadonlyMap<string, ReadonlySet<string>>
}

interface VisibleField {
  field: NonNullable<Node['fields'][number]>
  index: number
  visibleRow: number
}

interface RenderNode {
  node: Node
  flags: NodeFlags
  z: number
  range: NodeRange
  visibleFields: VisibleField[]
  rows: readonly NodeRow[]
  fullHeight: boolean
  corner: number
  headerH: number
  isGroup: boolean
}

type IconAtlasId = ApiAddressType | 'InitialCircle'

interface AtlasGlyph {
  u0: number
  v0: number
  u1: number
  v1: number
  advance: number
}

// Texture has a static ASCII slab and an LRU slab for runtime glyphs.
interface FontAtlas {
  texture: WebGLTexture
  refSize: number
  cellW: number
  cellH: number
  baselineOffset: number
  // Font ascent and descent in world units, for placing text in a CSS line box.
  ascent: number
  descent: number
  getGlyph: (ch: string) => AtlasGlyph
}

interface IconAtlas {
  texture: WebGLTexture
  cells: Map<IconAtlasId, { u0: number; v0: number; u1: number; v1: number }>
}

// ============================================================================
// Shaders
// ============================================================================

// Rounded-rect SDF pipeline. Each instance is a rect with per-corner radii and
// an optional border width (0 = filled). Distance is computed in world units
// so AA scales naturally with zoom.
const ROUND_VS = `#version 300 es
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec2 i_pos;
layout(location = 2) in vec2 i_size;
layout(location = 3) in vec4 i_color;
layout(location = 4) in vec4 i_radii; // TL, TR, BR, BL
layout(location = 5) in float i_border;
layout(location = 6) in float i_z;
layout(location = 7) in vec4 i_ring;
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
out vec4 v_color;
out vec2 v_local;
out vec2 v_halfSize;
out vec4 v_radii;
out float v_border;
out vec4 v_ring;
void main() {
  float pad = (i_border * 0.5) + 1.0;
  vec2 quadSize = i_size + vec2(pad * 2.0);
  vec2 quadOrigin = i_pos - vec2(pad);
  vec2 world = quadOrigin + a_corner * quadSize;
  vec2 screen = world * u_scale + u_offset;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, i_z, 1.0);
  v_color = i_color;
  vec2 rectCenter = i_pos + i_size * 0.5;
  v_local = world - rectCenter;
  v_halfSize = i_size * 0.5;
  v_radii = i_radii;
  v_border = i_border;
  v_ring = i_ring;
}`

const ROUND_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in vec2 v_local;
in vec2 v_halfSize;
in vec4 v_radii;
in float v_border;
in vec4 v_ring;
out vec4 fragColor;
const float RING_WIDTH = ${INITIAL_RING_WIDTH}.0;
float pickRadius(vec2 p, vec4 r) {
  float top    = (p.x > 0.0) ? r.y : r.x;
  float bottom = (p.x > 0.0) ? r.z : r.w;
  return (p.y > 0.0) ? bottom : top;
}
float sdRoundedBox(vec2 p, vec2 b, vec4 r) {
  float radius = pickRadius(p, r);
  radius = min(radius, min(b.x, b.y));
  vec2 q = abs(p) - b + vec2(radius);
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - radius;
}
void main() {
  float d = sdRoundedBox(v_local, v_halfSize, v_radii);
  float aa = max(fwidth(d), 1e-4);
  float alpha;
  if (v_border > 0.0) {
    float strokeD = abs(d) - v_border * 0.5;
    alpha = 1.0 - smoothstep(-aa, aa, strokeD);
  } else {
    alpha = 1.0 - smoothstep(-aa, aa, d);
  }
  if (alpha <= 0.0) discard;
  // Rings repeating every RING_WIDTH from the center, fading from the ring
  // color into the fill, mark initial contracts' headers.
  vec3 color = v_ring.a > 0.0
    ? mix(v_ring.rgb, v_color.rgb, mod(length(v_local), RING_WIDTH) / RING_WIDTH)
    : v_color.rgb;
  fragColor = vec4(color, v_color.a * alpha);
}`

// Fullscreen triangle with a dot at the center of every grid cell, so panning
// repaints nothing in the DOM.
const GRID_VS = `#version 300 es
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
out vec2 v_world;
void main() {
  vec2 ndc = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  vec2 screen = (ndc * vec2(1.0, -1.0) + 1.0) * 0.5 * u_resolution;
  v_world = (screen - u_offset) / u_scale;
  gl_Position = vec4(ndc, 0.0, 1.0);
}`

const GRID_FS = `#version 300 es
precision highp float;
in vec2 v_world;
uniform float u_cellSize;
uniform vec4 u_color;
out vec4 fragColor;
void main() {
  vec2 local = mod(v_world, u_cellSize) - u_cellSize * 0.5;
  float d = length(local) - u_cellSize * ${GRID_DOT_RADIUS_PER_CELL};
  float aa = max(fwidth(d), 1e-4);
  float alpha = 1.0 - smoothstep(-aa, aa, d);
  if (alpha <= 0.0) discard;
  fragColor = vec4(u_color.rgb, u_color.a * alpha);
}`

// Composites an offscreen layer of faded nodes. The layer holds
// premultiplied color, so scaling it by alpha fades it as a whole.
const FADE_VS = `#version 300 es
void main() {
  vec2 ndc = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
}`

const FADE_FS = `#version 300 es
precision mediump float;
uniform sampler2D u_layer;
uniform float u_alpha;
out vec4 fragColor;
void main() {
  fragColor = texelFetch(u_layer, ivec2(gl_FragCoord.xy), 0) * u_alpha;
}`

// Tinted alpha-mask quads. Shared by all text passes and the icon pass; the
// only thing that changes between draws is the bound texture.
const TEXT_VS = `#version 300 es
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec2 i_pos;
layout(location = 2) in vec2 i_size;
layout(location = 3) in vec4 i_uv;
layout(location = 4) in vec4 i_color;
layout(location = 5) in float i_z;
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
uniform float u_dpr;
out vec2 v_uv;
out vec4 v_color;
void main() {
  // Glyphs start on a device pixel so the atlas maps texel to pixel at full
  // zoom instead of being smeared across two pixels.
  vec2 origin = round((i_pos * u_scale + u_offset) * u_dpr) / u_dpr;
  vec2 screen = origin + a_corner * i_size * u_scale;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, i_z, 1.0);
  v_uv = mix(i_uv.xy, i_uv.zw, a_corner);
  v_color = i_color;
}`

const TEXT_FS = `#version 300 es
precision mediump float;
in vec2 v_uv;
in vec4 v_color;
uniform sampler2D u_atlas;
out vec4 fragColor;
void main() {
  float a = texture(u_atlas, v_uv).a;
  fragColor = vec4(v_color.rgb, v_color.a * a);
}`

// One instance per connection. The strip's vertices carry only (t, side), the
// curve is evaluated here, so moving a node rewrites a few floats per
// connection instead of re-tessellating every curve on the CPU.
const CONNECTION_VS = `#version 300 es
layout(location = 0) in vec2 a_vertex; // t, side
layout(location = 1) in vec2 i_from;
layout(location = 2) in vec2 i_to;
layout(location = 3) in vec2 i_controlX;
layout(location = 4) in vec4 i_color;
layout(location = 5) in vec2 i_stroke; // width, dashed
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
out vec4 v_color;
out float v_arc;
out float v_across;
flat out float v_halfWidth;
flat out float v_dashed;
const float SEGMENTS = ${CONNECTION_SEGMENTS}.0;
vec2 bezier(float t) {
  float mt = 1.0 - t;
  vec2 p1 = vec2(i_controlX.x, i_from.y);
  vec2 p2 = vec2(i_controlX.y, i_to.y);
  return mt * mt * mt * i_from + 3.0 * mt * mt * t * p1 +
    3.0 * mt * t * t * p2 + t * t * t * i_to;
}
vec2 bezierTangent(float t) {
  float mt = 1.0 - t;
  vec2 p1 = vec2(i_controlX.x, i_from.y);
  vec2 p2 = vec2(i_controlX.y, i_to.y);
  return 3.0 * mt * mt * (p1 - i_from) + 6.0 * mt * t * (p2 - p1) +
    3.0 * t * t * (i_to - p2);
}
void main() {
  float t = a_vertex.x;
  vec2 tangent = bezierTangent(t);
  float tangentLength = length(tangent);
  vec2 normal = tangentLength > 1e-6
    ? vec2(-tangent.y, tangent.x) / tangentLength
    : vec2(0.0, 1.0);
  vec2 world = bezier(t) + normal * (i_stroke.x * 0.5 * a_vertex.y);
  vec2 screen = world * u_scale + u_offset;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  v_color = i_color;
  v_halfWidth = i_stroke.x * 0.5;
  v_across = v_halfWidth * a_vertex.y;
  v_dashed = i_stroke.y;
  v_arc = 0.0;
  if (i_stroke.y > 0.5) {
    int steps = int(t * SEGMENTS + 0.5);
    vec2 previous = i_from;
    for (int k = 1; k <= steps; k++) {
      vec2 next = bezier(float(k) / SEGMENTS);
      v_arc += distance(previous, next);
      previous = next;
    }
  }
}`

// Dashes get round caps that reach into the gaps, like SVG's round linecap.
const CONNECTION_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in float v_arc;
in float v_across;
flat in float v_halfWidth;
flat in float v_dashed;
out vec4 fragColor;
const float DASH_ON = ${DASH_ON_WORLD}.0;
const float DASH_PERIOD = ${DASH_ON_WORLD + DASH_OFF_WORLD}.0;
void main() {
  float coverage = 1.0;
  if (v_dashed > 0.5) {
    float phase = mod(v_arc, DASH_PERIOD);
    if (phase > DASH_ON) {
      float along = min(phase - DASH_ON, DASH_PERIOD - phase);
      float d = length(vec2(along, v_across)) - v_halfWidth;
      float aa = max(fwidth(d), 1e-4);
      coverage = 1.0 - smoothstep(-aa, aa, d);
      if (coverage <= 0.0) discard;
    }
  }
  fragColor = vec4(v_color.rgb, v_color.a * coverage);
}`

// Dashed overlap perimeters. CPU-tessellated to short segments, expanded to
// triangle ribbons. Per-vertex color so we don't need to bucket.
const LINE_VS = `#version 300 es
layout(location = 0) in vec2 a_pos;
layout(location = 1) in vec4 a_color;
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
out vec4 v_color;
void main() {
  vec2 screen = a_pos * u_scale + u_offset;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  v_color = a_color;
}`

const LINE_FS = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 fragColor;
void main() { fragColor = v_color; }`

// ============================================================================
// WebGL helpers
// ============================================================================

function compileShader(
  gl: WebGL2RenderingContext,
  src: string,
  type: number,
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('createShader failed')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown'
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${log}`)
  }
  return shader
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string,
): WebGLProgram {
  const vert = compileShader(gl, vs, gl.VERTEX_SHADER)
  const frag = compileShader(gl, fs, gl.FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!program) throw new Error('createProgram failed')
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown'
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${log}`)
  }
  return program
}

function mustCreateBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
  const b = gl.createBuffer()
  if (!b) throw new Error('createBuffer failed')
  return b
}

function mustCreateVAO(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const v = gl.createVertexArray()
  if (!v) throw new Error('createVertexArray failed')
  return v
}

function requireUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLUniformLocation {
  const loc = gl.getUniformLocation(program, name)
  if (loc === null) throw new Error(`uniform ${name} not found`)
  return loc
}

function fontString(f: FontSpec, sizePx: number): string {
  const parts: string[] = []
  if (f.italic) parts.push('italic')
  if (f.weight) parts.push(String(f.weight))
  parts.push(`${sizePx}px`)
  parts.push(f.family)
  return parts.join(' ')
}

// ============================================================================
// Glyph atlas
// ============================================================================

const ATLAS_COLS = 16
const ATLAS_STATIC_ROWS = 6 // 95 ASCII glyphs + 1 fallback fit in 96 cells
const ATLAS_DYNAMIC_ROWS = 6
const ATLAS_FALLBACK_CH = '�'

function buildFontAtlas(
  gl: WebGL2RenderingContext,
  font: FontSpec,
  dpr: number,
): FontAtlas {
  const refSize = font.size
  const padding = 2
  const cellPxW = Math.ceil(refSize * dpr + padding * 2)
  const cellPxH = Math.ceil(refSize * dpr * 1.6 + padding * 2)
  const atlasPxW = cellPxW * ATLAS_COLS
  const atlasPxH = cellPxH * (ATLAS_STATIC_ROWS + ATLAS_DYNAMIC_ROWS)

  const initCanvas = newFontCanvas(font, dpr, atlasPxW, atlasPxH)
  const initCtx = initCanvas.getContext('2d') as CanvasRenderingContext2D
  // The font's ascent rather than one glyph's, so taller glyphs like "$" or
  // "[" stay inside their cell instead of bleeding into the one above.
  const ascentPx = initCtx.measureText('Mg').fontBoundingBoxAscent
  const descentPx = initCtx.measureText('Mg').fontBoundingBoxDescent
  const baselinePxY = ascentPx + padding
  if (baselinePxY + descentPx > cellPxH) {
    throw new Error('Font does not fit its atlas cell', { cause: font })
  }

  const glyphs = new Map<string, AtlasGlyph>()
  const rasterize = (ch: string, pxX: number, pxY: number): AtlasGlyph => {
    initCtx.save()
    initCtx.beginPath()
    initCtx.rect(pxX, pxY, cellPxW, cellPxH)
    initCtx.clip()
    initCtx.fillText(ch, pxX + padding, pxY + baselinePxY)
    initCtx.restore()
    return {
      u0: pxX / atlasPxW,
      v0: pxY / atlasPxH,
      u1: (pxX + cellPxW) / atlasPxW,
      v1: (pxY + cellPxH) / atlasPxH,
      advance: initCtx.measureText(ch).width / dpr,
    }
  }
  const staticCell = (i: number): [number, number] => [
    (i % ATLAS_COLS) * cellPxW,
    Math.floor(i / ATLAS_COLS) * cellPxH,
  ]
  for (let i = 0; i < 95; i++) {
    const ch = String.fromCharCode(32 + i)
    const [x, y] = staticCell(i)
    glyphs.set(ch, rasterize(ch, x, y))
  }
  const [fx, fy] = staticCell(95)
  const fallback = rasterize(ATLAS_FALLBACK_CH, fx, fy)
  glyphs.set(ATLAS_FALLBACK_CH, fallback)
  const texture = uploadCanvasTexture(gl, initCanvas)

  // Map iteration order = LRU order; oldest is `keys().next()`, newest is
  // the last `set`. Touching = delete + reinsert.
  const freeSlots: [number, number][] = []
  for (let r = ATLAS_DYNAMIC_ROWS - 1; r >= 0; r--) {
    for (let c = ATLAS_COLS - 1; c >= 0; c--) {
      freeSlots.push([c * cellPxW, (ATLAS_STATIC_ROWS + r) * cellPxH])
    }
  }
  const occupiedSlots = new Map<string, [number, number]>()
  const scratchCanvas = newFontCanvas(font, dpr, cellPxW, cellPxH)
  const scratchCtx = scratchCanvas.getContext('2d') as CanvasRenderingContext2D

  const getGlyph = (ch: string): AtlasGlyph => {
    const cached = glyphs.get(ch)
    if (cached) {
      const slot = occupiedSlots.get(ch)
      if (slot) {
        occupiedSlots.delete(ch)
        occupiedSlots.set(ch, slot)
      }
      return cached
    }
    const advancePx = scratchCtx.measureText(ch).width
    if (advancePx === 0) {
      glyphs.set(ch, fallback)
      return fallback
    }
    let slot = freeSlots.pop()
    if (!slot) {
      const lruKey = occupiedSlots.keys().next().value as string
      slot = occupiedSlots.get(lruKey) as [number, number]
      occupiedSlots.delete(lruKey)
      glyphs.delete(lruKey)
    }
    occupiedSlots.set(ch, slot)
    const [pxX, pxY] = slot
    scratchCtx.clearRect(0, 0, cellPxW, cellPxH)
    scratchCtx.fillText(ch, padding, baselinePxY)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      pxX,
      pxY,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      scratchCanvas,
    )
    const glyph: AtlasGlyph = {
      u0: pxX / atlasPxW,
      v0: pxY / atlasPxH,
      u1: (pxX + cellPxW) / atlasPxW,
      v1: (pxY + cellPxH) / atlasPxH,
      advance: advancePx / dpr,
    }
    glyphs.set(ch, glyph)
    return glyph
  }

  return {
    texture,
    refSize,
    cellW: cellPxW / dpr,
    cellH: cellPxH / dpr,
    baselineOffset: baselinePxY / dpr,
    ascent: ascentPx / dpr,
    descent: descentPx / dpr,
    getGlyph,
  }
}

// Where CSS puts the baseline of a line box: half the leading above the
// font's ascent.
function lineBoxBaseline(
  atlas: FontAtlas,
  lineTop: number,
  lineHeight: number,
): number {
  return (
    lineTop + (lineHeight - atlas.ascent - atlas.descent) / 2 + atlas.ascent
  )
}

function newFontCanvas(
  font: FontSpec,
  dpr: number,
  w: number,
  h: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('failed to get 2d context')
  ctx.font = fontString(font, font.size * dpr)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'white'
  return canvas
}

// ============================================================================
// Icon atlas
// ============================================================================

const ICON_ATLAS_SUPERSAMPLE = 2

const ICON_LIST = [
  ...(
    [
      'EOA',
      'EOAPermissioned',
      'Unverified',
      'Token',
      'Multisig',
      'Timelock',
      'Diamond',
      'Untemplatized',
      'Contract',
      'Group',
      'Unknown',
    ] as const
  ).map((id) => ({
    id,
    Component: ADDRESS_ICON_COMPONENTS[id],
  })),
  { id: 'InitialCircle' as const, Component: IconInitial },
]

async function buildIconAtlas(
  gl: WebGL2RenderingContext,
  dpr: number,
): Promise<IconAtlas> {
  const cellPx = Math.ceil(ICON_VIEW_BOX * dpr * ICON_ATLAS_SUPERSAMPLE)
  const count = ICON_LIST.length
  const cols = 4
  const rows = Math.ceil(count / cols)
  const atlasPxW = cellPx * cols
  const atlasPxH = cellPx * rows

  const canvas = document.createElement('canvas')
  canvas.width = atlasPxW
  canvas.height = atlasPxH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('failed to get icon atlas 2d context')

  const cells = new Map<
    IconAtlasId,
    { u0: number; v0: number; u1: number; v1: number }
  >()

  for (let i = 0; i < count; i++) {
    const entry = ICON_LIST[i]
    if (!entry) continue
    const col = i % cols
    const row = Math.floor(i / cols)
    const px = col * cellPx
    const py = row * cellPx
    const image = await loadSvgImage(renderWhiteIconSvg(entry.Component))
    ctx.drawImage(image, px, py, cellPx, cellPx)
    cells.set(entry.id, {
      u0: px / atlasPxW,
      v0: py / atlasPxH,
      u1: (px + cellPx) / atlasPxW,
      v1: (py + cellPx) / atlasPxH,
    })
  }

  const texture = uploadCanvasTexture(gl, canvas)
  return { texture, cells }
}

function renderWhiteIconSvg(
  Component: ComponentType<{ className?: string }>,
): string {
  const svg = renderToStaticMarkup(<Component />)
  return svg.replace('<svg ', '<svg color="white" ')
}

function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('failed to load icon svg'))
    }
    image.src = url
  })
}

function uploadCanvasTexture(
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
): WebGLTexture {
  const texture = gl.createTexture()
  if (!texture) throw new Error('createTexture failed')
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

// ============================================================================
// Renderer
// ============================================================================

interface Programs {
  fade: WebGLProgram
  grid: WebGLProgram
  round: WebGLProgram
  text: WebGLProgram
  line: WebGLProgram
  connection: WebGLProgram
}

interface Uniforms {
  fade: {
    layer: WebGLUniformLocation
    alpha: WebGLUniformLocation
  }
  grid: {
    offset: WebGLUniformLocation
    scale: WebGLUniformLocation
    resolution: WebGLUniformLocation
    cellSize: WebGLUniformLocation
    color: WebGLUniformLocation
  }
  round: {
    offset: WebGLUniformLocation
    scale: WebGLUniformLocation
    resolution: WebGLUniformLocation
  }
  text: {
    offset: WebGLUniformLocation
    scale: WebGLUniformLocation
    resolution: WebGLUniformLocation
    dpr: WebGLUniformLocation
    atlas: WebGLUniformLocation
  }
  line: {
    offset: WebGLUniformLocation
    scale: WebGLUniformLocation
    resolution: WebGLUniformLocation
  }
  connection: {
    offset: WebGLUniformLocation
    scale: WebGLUniformLocation
    resolution: WebGLUniformLocation
  }
}

// Each pass keeps its own GPU instance/vertex buffer so they don't trample
// each other. The corner quad is shared by every instanced pass.
interface PassBuffer {
  data: WebGLBuffer
  vao: WebGLVertexArrayObject
}

// WebGL2 has no base instance, so drawing a range of instances points the
// per-instance attributes at the range's first instance.
interface InstanceAttributes {
  strideF: number
  sizes: readonly number[]
}

interface InstancedPassBuffer extends PassBuffer {
  attributes: InstanceAttributes
}

// pos.xy, size.xy, color.rgba, radii.xyzw, border, z, ring.rgba
const ROUND_ATTRIBUTES: InstanceAttributes = {
  strideF: QUAD_STRIDE_F,
  sizes: [2, 2, 4, 4, 1, 1, 4],
}
// pos.xy, size.xy, uv.xyzw, color.rgba, z
const TEXT_ATTRIBUTES: InstanceAttributes = {
  strideF: TEXT_STRIDE_F,
  sizes: [2, 2, 4, 4, 1],
}

function pointInstances(
  gl: WebGL2RenderingContext,
  pass: InstancedPassBuffer,
  firstInstance: number,
) {
  const stride = pass.attributes.strideF * 4
  let offset = firstInstance * stride
  gl.bindVertexArray(pass.vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, pass.data)
  for (let i = 0; i < pass.attributes.sizes.length; i++) {
    const size = pass.attributes.sizes[i] as number
    gl.vertexAttribPointer(i + 1, size, gl.FLOAT, false, stride, offset)
    offset += size * 4
  }
}

interface Buffers {
  cornerQuad: WebGLBuffer
  connectionStrip: WebGLBuffer
  round: InstancedPassBuffer
  headerText: InstancedPassBuffer
  fieldText: InstancedPassBuffer
  footerText: InstancedPassBuffer
  icon: InstancedPassBuffer
  connections: PassBuffer
  overlap: PassBuffer
}

interface ConnectionSpan {
  node: Node
  target: Node
  field: Field
  fieldIndex: number
  isDashed: boolean
}

// Cached counts: how many instances / vertices each pass should draw. Zero
// means "skip the draw call". These are filled by `rebuildAll(data)` and
// stay valid until the data ref changes.
interface PassCounts {
  round: PassLayout
  headerText: PassLayout
  fieldText: PassLayout
  footerText: PassLayout
  icon: PassLayout
  connections: number
  overlap: number
}

// Node passes draw in four ranges: open-group containers, grayed-out nodes,
// dimmed nodes, and everything at full opacity. The faded ranges are drawn
// opaque offscreen and composited with one alpha each, which is how CSS
// opacity fades a node as a whole instead of each of its layers.
const CONTAINER_RANGE = 0
const GRAYED_RANGE = 1
const DIMMED_RANGE = 2
const OPAQUE_RANGE = 3
type NodeRange = typeof GRAYED_RANGE | typeof DIMMED_RANGE | typeof OPAQUE_RANGE
type DrawRange = typeof CONTAINER_RANGE | NodeRange
const GRAYED_ALPHA = 0.2
const DIMMED_ALPHA = 0.3

// Instance index where each range ends, in draw order.
type PassLayout = readonly [number, number, number, number]
const EMPTY_LAYOUT: PassLayout = [0, 0, 0, 0]

function rangeStart(layout: PassLayout, range: DrawRange): number {
  if (range === CONTAINER_RANGE) return 0
  return layout[range - 1] as number
}

function rangeCount(layout: PassLayout, range: DrawRange): number {
  return layout[range] - rangeStart(layout, range)
}

interface FadeLayer {
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture
  depth: WebGLRenderbuffer
  width: number
  height: number
}

function createFadeLayer(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): FadeLayer {
  const texture = gl.createTexture()
  const depth = gl.createRenderbuffer()
  const framebuffer = gl.createFramebuffer()
  if (!texture || !depth || !framebuffer) {
    throw new Error('Failed to create the fade layer')
  }
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height)
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depth,
  )
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('Incomplete fade layer', { cause: { status } })
  }
  return { framebuffer, texture, depth, width, height }
}

function deleteFadeLayer(gl: WebGL2RenderingContext, layer: FadeLayer) {
  gl.deleteFramebuffer(layer.framebuffer)
  gl.deleteTexture(layer.texture)
  gl.deleteRenderbuffer(layer.depth)
}

// Builds walk containers, then nodes ordered by range, and enter each range
// as they reach it.
class PassLayoutBuilder {
  private readonly ends = [0, 0, 0, 0]
  private range: DrawRange = CONTAINER_RANGE

  enter(range: DrawRange, instance: number) {
    if (range < this.range) throw new Error('Node ranges out of order')
    while (this.range < range) {
      this.ends[this.range] = instance
      this.range++
    }
  }

  finish(instance: number): PassLayout {
    this.enter(OPAQUE_RANGE, instance)
    this.ends[OPAQUE_RANGE] = instance
    return [
      this.ends[0],
      this.ends[1],
      this.ends[2],
      this.ends[3],
    ] as PassLayout
  }
}

class WebGLRenderer {
  private gl: WebGL2RenderingContext
  // The atlases are rasterized for this ratio.
  private readonly dpr: number
  private programs: Programs
  private uniforms: Uniforms
  private buffers: Buffers
  private headerAtlas: FontAtlas
  private fieldAtlas: FontAtlas
  private footerAtlas: FontAtlas
  private iconAtlas: IconAtlas

  // Cache: the data ref that the GPU buffers currently describe. When the
  // next render() arrives with a different ref, all buffers are rebuilt.
  // While it stays the same (pan/zoom), we just push new transform uniforms
  // and re-issue the same draw calls.
  private cachedData: DrawData | null = null
  private counts: PassCounts = {
    round: EMPTY_LAYOUT,
    headerText: EMPTY_LAYOUT,
    fieldText: EMPTY_LAYOUT,
    footerText: EMPTY_LAYOUT,
    icon: EMPTY_LAYOUT,
    connections: 0,
    overlap: 0,
  }

  // Per-pipeline scratch arrays grow as needed; never shrink.
  private roundData = new Float32Array(0)
  private textData = new Float32Array(0)
  private lineData = new Float32Array(0)
  private connectionData = new Float32Array(0)
  private fadeLayer: FadeLayer | null = null

  static async create(
    gl: WebGL2RenderingContext,
    dpr: number,
  ): Promise<WebGLRenderer> {
    const iconAtlas = await buildIconAtlas(gl, dpr)
    return new WebGLRenderer(gl, dpr, iconAtlas)
  }

  private constructor(
    gl: WebGL2RenderingContext,
    dpr: number,
    iconAtlas: IconAtlas,
  ) {
    this.gl = gl
    this.dpr = dpr
    this.programs = {
      fade: linkProgram(gl, FADE_VS, FADE_FS),
      grid: linkProgram(gl, GRID_VS, GRID_FS),
      round: linkProgram(gl, ROUND_VS, ROUND_FS),
      text: linkProgram(gl, TEXT_VS, TEXT_FS),
      line: linkProgram(gl, LINE_VS, LINE_FS),
      connection: linkProgram(gl, CONNECTION_VS, CONNECTION_FS),
    }
    this.uniforms = {
      fade: {
        layer: requireUniform(gl, this.programs.fade, 'u_layer'),
        alpha: requireUniform(gl, this.programs.fade, 'u_alpha'),
      },
      grid: {
        offset: requireUniform(gl, this.programs.grid, 'u_offset'),
        scale: requireUniform(gl, this.programs.grid, 'u_scale'),
        resolution: requireUniform(gl, this.programs.grid, 'u_resolution'),
        cellSize: requireUniform(gl, this.programs.grid, 'u_cellSize'),
        color: requireUniform(gl, this.programs.grid, 'u_color'),
      },
      round: {
        offset: requireUniform(gl, this.programs.round, 'u_offset'),
        scale: requireUniform(gl, this.programs.round, 'u_scale'),
        resolution: requireUniform(gl, this.programs.round, 'u_resolution'),
      },
      text: {
        offset: requireUniform(gl, this.programs.text, 'u_offset'),
        scale: requireUniform(gl, this.programs.text, 'u_scale'),
        resolution: requireUniform(gl, this.programs.text, 'u_resolution'),
        dpr: requireUniform(gl, this.programs.text, 'u_dpr'),
        atlas: requireUniform(gl, this.programs.text, 'u_atlas'),
      },
      line: {
        offset: requireUniform(gl, this.programs.line, 'u_offset'),
        scale: requireUniform(gl, this.programs.line, 'u_scale'),
        resolution: requireUniform(gl, this.programs.line, 'u_resolution'),
      },
      connection: {
        offset: requireUniform(gl, this.programs.connection, 'u_offset'),
        scale: requireUniform(gl, this.programs.connection, 'u_scale'),
        resolution: requireUniform(
          gl,
          this.programs.connection,
          'u_resolution',
        ),
      },
    }
    this.headerAtlas = buildFontAtlas(gl, HEADER_FONT, dpr)
    this.fieldAtlas = buildFontAtlas(gl, FIELD_FONT, dpr)
    this.footerAtlas = buildFontAtlas(gl, FOOTER_FONT, dpr)
    this.iconAtlas = iconAtlas
    this.buffers = this.createBuffers()

    gl.enable(gl.BLEND)
    this.useCoverageBlending()
    gl.depthFunc(gl.LEQUAL)
    gl.clearColor(0, 0, 0, 0)
  }

  private createBuffers(): Buffers {
    const gl = this.gl
    const cornerQuad = mustCreateBuffer(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerQuad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const round = this.createRoundPassBuffer(cornerQuad)
    const headerText = this.createTextPassBuffer(cornerQuad)
    const fieldText = this.createTextPassBuffer(cornerQuad)
    const footerText = this.createTextPassBuffer(cornerQuad)
    const icon = this.createTextPassBuffer(cornerQuad)
    const connectionStrip = createConnectionStrip(gl)
    const connections = this.createConnectionPassBuffer(connectionStrip)
    const overlap = this.createLinePassBuffer()

    gl.bindVertexArray(null)

    return {
      cornerQuad,
      connectionStrip,
      round,
      headerText,
      fieldText,
      footerText,
      icon,
      connections,
      overlap,
    }
  }

  private createConnectionPassBuffer(strip: WebGLBuffer): PassBuffer {
    const gl = this.gl
    const data = mustCreateBuffer(gl)
    const vao = mustCreateVAO(gl)
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, strip)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, data)
    const stride = CONNECTION_STRIDE_F * 4
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 0)
    gl.vertexAttribDivisor(1, 1)
    gl.enableVertexAttribArray(2)
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 8)
    gl.vertexAttribDivisor(2, 1)
    gl.enableVertexAttribArray(3)
    gl.vertexAttribPointer(3, 2, gl.FLOAT, false, stride, 16)
    gl.vertexAttribDivisor(3, 1)
    gl.enableVertexAttribArray(4)
    gl.vertexAttribPointer(4, 4, gl.FLOAT, false, stride, 24)
    gl.vertexAttribDivisor(4, 1)
    gl.enableVertexAttribArray(5)
    gl.vertexAttribPointer(5, 2, gl.FLOAT, false, stride, 40)
    gl.vertexAttribDivisor(5, 1)
    return { data, vao }
  }

  private createRoundPassBuffer(cornerQuad: WebGLBuffer): InstancedPassBuffer {
    return this.createInstancedPassBuffer(cornerQuad, ROUND_ATTRIBUTES)
  }

  private createTextPassBuffer(cornerQuad: WebGLBuffer): InstancedPassBuffer {
    return this.createInstancedPassBuffer(cornerQuad, TEXT_ATTRIBUTES)
  }

  private createInstancedPassBuffer(
    cornerQuad: WebGLBuffer,
    attributes: InstanceAttributes,
  ): InstancedPassBuffer {
    const gl = this.gl
    const data = mustCreateBuffer(gl)
    const vao = mustCreateVAO(gl)
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerQuad)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    for (let i = 0; i < attributes.sizes.length; i++) {
      gl.enableVertexAttribArray(i + 1)
      gl.vertexAttribDivisor(i + 1, 1)
    }
    const pass = { data, vao, attributes }
    pointInstances(gl, pass, 0)
    return pass
  }

  private createLinePassBuffer(): PassBuffer {
    const gl = this.gl
    const data = mustCreateBuffer(gl)
    const vao = mustCreateVAO(gl)
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, data)
    const stride = LINE_STRIDE_F * 4
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 8)
    return { data, vao }
  }

  render(
    data: DrawData,
    transform: { offsetX: number; offsetY: number; scale: number },
    cssWidth: number,
    cssHeight: number,
    dpr: number,
  ) {
    const gl = this.gl
    const pixelW = Math.max(1, Math.floor(cssWidth * dpr))
    const pixelH = Math.max(1, Math.floor(cssHeight * dpr))
    if (gl.canvas.width !== pixelW) gl.canvas.width = pixelW
    if (gl.canvas.height !== pixelH) gl.canvas.height = pixelH
    gl.viewport(0, 0, pixelW, pixelH)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    if (data !== this.cachedData) {
      this.rebuildAll(data)
      this.cachedData = data
    }

    const res: [number, number] = [cssWidth, cssHeight]

    // Connections draw first (under nodes). Within a range, node order is set
    // by how the instance buffers are filled (selected last). Overlap borders
    // draw last.
    gl.disable(gl.DEPTH_TEST)
    this.drawGridPass(transform, res)
    this.drawConnectionPass(transform, res)
    gl.enable(gl.DEPTH_TEST)
    this.drawNodeRange(CONTAINER_RANGE, transform, res)
    this.drawFadedRange(GRAYED_RANGE, GRAYED_ALPHA, transform, res)
    this.drawFadedRange(DIMMED_RANGE, DIMMED_ALPHA, transform, res)
    this.drawNodeRange(OPAQUE_RANGE, transform, res)
    gl.disable(gl.DEPTH_TEST)
    this.drawLinePass(this.buffers.overlap, this.counts.overlap, transform, res)
  }

  // The canvas is premultiplied, so alpha has to accumulate as coverage
  // rather than as alpha squared, or the page shows through translucent
  // primitives.
  private useCoverageBlending() {
    const gl = this.gl
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    )
  }

  // ==========================================================================
  // BUILD PHASE — runs when the data ref changes. Fills scratch buffers and
  // uploads to GPU. After this, per-frame work is just uniform updates + draw.
  // ==========================================================================

  private rebuildAll(data: DrawData) {
    const renderNodes = buildRenderNodes(data)
    this.counts.round = this.buildRound(
      renderNodes,
      data.containers,
      data.selectedContainers,
    )
    this.counts.icon = this.buildIcons(
      renderNodes,
      data.containers,
      data.selectedContainers,
    )
    this.counts.headerText = this.buildHeaderText(
      renderNodes,
      data.containers,
      data.selectedContainers,
    )
    this.counts.fieldText = this.buildFieldText(renderNodes)
    this.counts.footerText = this.buildFooterText(renderNodes)
    this.counts.connections = this.buildConnections(data)
    this.counts.overlap = this.buildOverlap(renderNodes)
  }

  private buildRound(
    renderNodes: readonly RenderNode[],
    containers: readonly GroupContainer[],
    selectedContainers: ReadonlySet<string>,
  ): PassLayout {
    // Upper bound: 4 quads (body, header, selection, group outline) per node,
    // plus one pill per visible field, plus two quads (outline, header bar)
    // per open-group container.
    let maxInstances = renderNodes.length * 4 + containers.length * 2
    for (const rn of renderNodes) maxInstances += rn.visibleFields.length
    if (maxInstances === 0) return EMPTY_LAYOUT
    const buf = this.ensureRound(maxInstances)
    const layout = new PassLayoutBuilder()

    const r = CONTAINER_CORNER_RADIUS
    const w = CONTAINER_OUTLINE_WIDTH
    let n = 0
    for (const { box: b, headerBox: h, id } of containers) {
      const line = selectedContainers.has(id) ? AUTUMN_300 : COFFEE_200
      const bar = selectedContainers.has(id) ? AUTUMN_300 : COFFEE_600
      writeRound(
        buf,
        n++,
        b.x,
        b.y,
        b.width,
        b.height,
        line,
        r,
        r,
        r,
        r,
        w,
        CONTAINER_Z,
        NO_RING,
      )
      writeRound(
        buf,
        n++,
        h.x,
        h.y,
        h.width,
        h.height,
        bar,
        r,
        r,
        0,
        0,
        0,
        CONTAINER_Z,
        NO_RING,
      )
    }
    for (const rn of renderNodes) {
      const { node, flags, z, corner, headerH } = rn
      layout.enter(rn.range, n)
      const { x, y, width, height } = node.box

      if (flags.isSelected) {
        const inset = SELECTION_OUTLINE_INSET
        writeRound(
          buf,
          n++,
          x - inset,
          y - inset,
          width + inset * 2,
          height + inset * 2,
          AUTUMN_300,
          corner + inset,
          corner + inset,
          corner + inset,
          corner + inset,
          SELECTION_OUTLINE_WIDTH,
          z,
          NO_RING,
        )
      }

      writeRound(
        buf,
        n++,
        x,
        y,
        width,
        height,
        BLACK,
        corner,
        corner,
        corner,
        corner,
        0,
        z,
        NO_RING,
      )

      const { color: headerCssColor, ringColor } = getColor(node)
      const headerRgb = cssRgbToRgba(headerCssColor)
      const headerColor = flags.isGrayedOut ? desaturate(headerRgb) : headerRgb
      const ringRgb = cssRgbToRgba(ringColor)
      const headerRing = !node.isInitial
        ? NO_RING
        : flags.isGrayedOut
          ? desaturate(ringRgb)
          : ringRgb
      const headerBR = rn.fullHeight ? corner : 0
      const headerBL = rn.fullHeight ? corner : 0
      writeRound(
        buf,
        n++,
        x,
        y,
        width,
        headerH,
        headerColor,
        corner,
        corner,
        headerBR,
        headerBL,
        0,
        z,
        headerRing,
      )

      if (rn.isGroup) {
        const inset = GROUP_OUTLINE_INSET
        writeRound(
          buf,
          n++,
          x - inset,
          y - inset,
          width + inset * 2,
          height + inset * 2,
          COFFEE_200,
          corner + inset,
          corner + inset,
          corner + inset,
          corner + inset,
          GROUP_OUTLINE_WIDTH,
          z,
          NO_RING,
        )
      }

      for (const { index, visibleRow } of rn.visibleFields) {
        if (flags.fieldHighlighted[index]) {
          const rowY = y + HEADER_HEIGHT + visibleRow * FIELD_HEIGHT
          const pillRadius = FIELD_HEIGHT / 2
          writeRound(
            buf,
            n++,
            x,
            rowY,
            width,
            FIELD_HEIGHT,
            AUTUMN_300,
            pillRadius,
            pillRadius,
            pillRadius,
            pillRadius,
            0,
            z,
            NO_RING,
          )
        }
      }
    }

    this.upload(this.buffers.round.data, buf, n, QUAD_STRIDE_F)
    return layout.finish(n)
  }

  private buildIcons(
    renderNodes: readonly RenderNode[],
    containers: readonly GroupContainer[],
    selectedContainers: ReadonlySet<string>,
  ): PassLayout {
    let max = renderNodes.length * 3 + containers.length
    for (const rn of renderNodes) max += rn.visibleFields.length
    if (max === 0) return EMPTY_LAYOUT
    const buf = this.ensureText(max)
    const layout = new PassLayoutBuilder()

    let n = 0
    for (const { headerBox: h, id } of containers) {
      const iconY = h.y + (h.height - HEADER_ICON_SIZE) / 2
      const color = selectedContainers.has(id) ? BLACK : COFFEE_200
      n += this.emitIcon(
        buf,
        n,
        'Group',
        h.x + HEADER_PADDING,
        iconY,
        HEADER_ICON_SIZE,
        color,
        CONTAINER_Z,
      )
    }
    for (const rn of renderNodes) {
      const { node, flags, z, headerH } = rn
      layout.enter(rn.range, n)
      const { x, y, width } = node.box
      const iconY = y + (headerH - HEADER_ICON_SIZE) / 2

      const { isDark } = getColor(node)
      const headerTextColor = isDark ? COFFEE_200 : BLACK
      const addrColor =
        node.addressType === 'Unverified' ? AUX_RED : headerTextColor
      n += this.emitIcon(
        buf,
        n,
        node.addressType,
        x + HEADER_PADDING,
        iconY,
        HEADER_ICON_SIZE,
        flags.isGrayedOut ? desaturate(addrColor) : addrColor,
        z,
      )

      let rightX = x + width - HEADER_PADDING
      if (node.hasTemplate) {
        rightX -= HEADER_ICON_SIZE
        n += this.emitIcon(
          buf,
          n,
          'InitialCircle',
          rightX,
          iconY,
          HEADER_ICON_SIZE,
          AUX_ORANGE,
          z,
        )
      }
      if (node.isInitial) {
        rightX -= HEADER_ICON_SIZE
        n += this.emitIcon(
          buf,
          n,
          'InitialCircle',
          rightX,
          iconY,
          HEADER_ICON_SIZE,
          AUX_GREEN,
          z,
        )
      }

      // Field connection dots. The dot needs a visible diameter of
      // DOT_RADIUS*2 (=10) world units, centered on the box edge. The atlas
      // glyph draws a circle that fills 50% of its cell, so we render at a
      // cell size of 4*DOT_RADIUS (=20) to get a 10-wide visible disc.
      for (const { field, index, visibleRow } of rn.visibleFields) {
        if (!flags.fieldTargetHidden[index]) {
          const rowY = y + HEADER_HEIGHT + visibleRow * FIELD_HEIGHT
          const isLeft = field.connection.from.direction === 'left'
          const dotX = isLeft ? x : x + width
          const dotY = rowY + FIELD_HEIGHT / 2
          const useAutumn =
            flags.isSelected || flags.fieldHighlighted[index] === 1
          const dotColor = flags.isGrayedOut
            ? desaturate(COFFEE_400)
            : useAutumn
              ? AUTUMN_300
              : COFFEE_400
          n += this.emitIcon(
            buf,
            n,
            'InitialCircle',
            dotX - FIELD_DOT_CELL / 2,
            dotY - FIELD_DOT_CELL / 2,
            FIELD_DOT_CELL,
            dotColor,
            z,
          )
        }
      }
    }

    this.upload(this.buffers.icon.data, buf, n, TEXT_STRIDE_F)
    return layout.finish(n)
  }

  private emitIcon(
    buf: Float32Array,
    startInstance: number,
    id: IconAtlasId,
    x: number,
    y: number,
    size: number,
    color: RGBA,
    z: number,
  ): number {
    const cell = this.iconAtlas.cells.get(id)
    if (!cell) return 0
    writeTextQuad(
      buf,
      startInstance,
      x,
      y,
      size,
      size,
      cell.u0,
      cell.v0,
      cell.u1,
      cell.v1,
      color,
      z,
    )
    return 1
  }

  private buildHeaderText(
    renderNodes: readonly RenderNode[],
    containers: readonly GroupContainer[],
    selectedContainers: ReadonlySet<string>,
  ): PassLayout {
    let maxChars = 0
    for (const { node } of renderNodes) maxChars += node.name.length
    for (const group of containers) maxChars += group.name.length
    if (maxChars === 0) return EMPTY_LAYOUT
    const buf = this.ensureText(maxChars)
    const layout = new PassLayoutBuilder()
    const atlas = this.headerAtlas
    let n = 0
    for (const { name, headerBox: h, id } of containers) {
      const baselineY = h.y + h.height / 2 + atlas.refSize / 2 - 2
      n += writeStringInstances(
        buf,
        n,
        name,
        h.x + HEADER_PADDING + HEADER_ICON_SIZE + HEADER_ITEM_GAP,
        baselineY,
        atlas,
        selectedContainers.has(id) ? BLACK : COFFEE_200,
        h.x + h.width - HEADER_PADDING,
        CONTAINER_Z,
      )
    }
    for (const { node, flags, z, range, headerH } of renderNodes) {
      layout.enter(range, n)
      const { isDark } = getColor(node)
      const baseColor = isDark ? COFFEE_200 : BLACK
      const color = flags.isGrayedOut ? desaturate(baseColor) : baseColor
      const startX =
        node.box.x + HEADER_PADDING + HEADER_ICON_SIZE + HEADER_ITEM_GAP
      let rightX = node.box.x + node.box.width - HEADER_PADDING
      if (node.hasTemplate) rightX -= HEADER_ICON_SIZE
      if (node.isInitial) rightX -= HEADER_ICON_SIZE
      const maxX = rightX - HEADER_ITEM_GAP
      const baselineY = node.box.y + headerH / 2 + atlas.refSize / 2 - 2
      // A short name sits centered between the address icon and the badges.
      const slack = maxX - startX - measureString(node.name, atlas)
      n += writeStringInstances(
        buf,
        n,
        node.name,
        startX + Math.max(0, slack / 2),
        baselineY,
        atlas,
        color,
        maxX,
        z,
      )
    }
    this.upload(this.buffers.headerText.data, buf, n, TEXT_STRIDE_F)
    return layout.finish(n)
  }

  private buildFieldText(renderNodes: readonly RenderNode[]): PassLayout {
    let maxChars = 0
    for (const rn of renderNodes) {
      for (const row of rn.rows) {
        maxChars += row.label.length
      }
    }
    if (maxChars === 0) return EMPTY_LAYOUT
    const buf = this.ensureText(maxChars)
    const atlas = this.fieldAtlas
    const layout = new PassLayoutBuilder()
    let n = 0
    for (const rn of renderNodes) {
      const { node, flags, z } = rn
      layout.enter(rn.range, n)
      for (let row = 0; row < rn.rows.length; row++) {
        const rowY = node.box.y + HEADER_HEIGHT + row * FIELD_HEIGHT
        const baselineY = rowY + FIELD_HEIGHT / 2 + atlas.refSize / 2 - 2
        const baseColor = isRowHighlighted(rn, row) ? BLACK : COFFEE_200
        const color = flags.isGrayedOut ? desaturate(baseColor) : baseColor
        n += writeStringInstances(
          buf,
          n,
          (rn.rows[row] as NodeRow).label,
          node.box.x + HEADER_PADDING,
          baselineY,
          atlas,
          color,
          node.box.x + node.box.width - HEADER_PADDING,
          z,
        )
      }
    }
    this.upload(this.buffers.fieldText.data, buf, n, TEXT_STRIDE_F)
    return layout.finish(n)
  }

  private buildFooterText(renderNodes: readonly RenderNode[]): PassLayout {
    let any = false
    let maxChars = 0
    for (const { node } of renderNodes) {
      if (node.hiddenFields.length > 0) {
        any = true
        maxChars += 30
      }
    }
    if (!any) return EMPTY_LAYOUT
    const buf = this.ensureText(maxChars)
    const atlas = this.footerAtlas
    const layout = new PassLayoutBuilder()
    let n = 0
    for (const { node, flags, z, range, rows } of renderNodes) {
      layout.enter(range, n)
      if (node.hiddenFields.length === 0) continue
      const label = `+${node.hiddenFields.length} hidden field${
        node.hiddenFields.length > 1 ? 's' : ''
      }`
      const footerBottom =
        node.box.y +
        HEADER_HEIGHT +
        rows.length * FIELD_HEIGHT +
        HIDDEN_FIELDS_FOOTER_HEIGHT
      const baselineY = lineBoxBaseline(
        atlas,
        footerBottom - FOOTER_LINE_HEIGHT,
        FOOTER_LINE_HEIGHT,
      )
      const baseColor = withAlpha(COFFEE_200, 0.4)
      const color = flags.isGrayedOut ? desaturate(baseColor) : baseColor
      const labelWidth = measureString(label, atlas)
      const startX = node.box.x + (node.box.width - labelWidth) / 2
      n += writeStringInstances(
        buf,
        n,
        label,
        startX,
        baselineY,
        atlas,
        color,
        node.box.x + node.box.width,
        z,
      )
    }
    this.upload(this.buffers.footerText.data, buf, n, TEXT_STRIDE_F)
    return layout.finish(n)
  }

  private upload(
    buffer: WebGLBuffer,
    src: Float32Array,
    n: number,
    stride: number,
  ): number {
    if (n === 0) return 0
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, src.subarray(0, n * stride), gl.STATIC_DRAW)
    return n
  }

  // Highlighted connections go last so they draw on top.
  private buildConnections(data: DrawData): number {
    const spans = liveConnections(data)
    if (spans.length === 0) return 0
    const buffer = this.ensureConnections(spans.length)
    const highlighted: ConnectionSpan[] = []
    let n = 0
    for (const span of spans) {
      if (isConnectionHighlighted(span, data)) {
        highlighted.push(span)
        continue
      }
      writeConnection(
        buffer,
        n++,
        span,
        CONNECTION_WIDTH,
        connectionColor(span, data),
      )
    }
    for (const span of highlighted) {
      writeConnection(
        buffer,
        n++,
        span,
        HIGHLIGHTED_CONNECTION_WIDTH,
        AUTUMN_300,
      )
    }
    return this.upload(
      this.buffers.connections.data,
      buffer,
      n,
      CONNECTION_STRIDE_F,
    )
  }

  private buildOverlap(renderNodes: readonly RenderNode[]): number {
    let anyOverlap = false
    for (const { flags } of renderNodes) {
      if (flags.isOverlapping && !flags.isDimmed && !flags.isGrayedOut) {
        anyOverlap = true
        break
      }
    }
    if (!anyOverlap) return 0
    const samplesPerNode = 4 * 2 + PERIMETER_SAMPLES_PER_CORNER * 4 + 4
    const maxVertices = renderNodes.length * samplesPerNode * 6
    const buf = this.ensureLine(maxVertices)

    let v = 0
    for (const { node, flags, corner } of renderNodes) {
      if (!flags.isOverlapping) continue
      if (flags.isDimmed || flags.isGrayedOut) continue
      const { color: cssColor } = getColor(node)
      const rgb = cssRgbToRgba(cssColor)
      const perimeter = roundedRectPerimeter(
        node.box.x,
        node.box.y,
        node.box.width,
        node.box.height,
        corner,
      )
      v += emitDashedRibbon(buf, v, perimeter, OVERLAP_BORDER_WIDTH, rgb, 6, 6)
    }
    return this.upload(this.buffers.overlap.data, buf, v, LINE_STRIDE_F)
  }

  // ==========================================================================
  // DRAW PHASE — runs every frame. Sets uniforms (the transform changes),
  // binds the pre-built VAO/texture, issues a single draw call. No CPU work
  // proportional to node count.
  // ==========================================================================

  private drawGridPass(
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    const gl = this.gl
    gl.useProgram(this.programs.grid)
    gl.uniform2f(
      this.uniforms.grid.offset,
      transform.offsetX,
      transform.offsetY,
    )
    gl.uniform1f(this.uniforms.grid.scale, transform.scale)
    gl.uniform2f(this.uniforms.grid.resolution, res[0], res[1])
    gl.uniform1f(this.uniforms.grid.cellSize, getGridCellSize(transform.scale))
    gl.uniform4fv(this.uniforms.grid.color, GRID_DOT)
    gl.bindVertexArray(null)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  private drawNodeRange(
    range: DrawRange,
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    this.drawRoundPass(range, transform, res)
    this.drawTextPass(
      this.buffers.icon,
      this.iconAtlas.texture,
      this.counts.icon,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.headerText,
      this.headerAtlas.texture,
      this.counts.headerText,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.fieldText,
      this.fieldAtlas.texture,
      this.counts.fieldText,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.footerText,
      this.footerAtlas.texture,
      this.counts.footerText,
      range,
      transform,
      res,
    )
  }

  private drawFadedRange(
    range: NodeRange,
    alpha: number,
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    if (rangeCount(this.counts.round, range) === 0) return
    const gl = this.gl
    const layer = this.ensureFadeLayer(
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.drawNodeRange(range, transform, res)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    gl.disable(gl.DEPTH_TEST)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.useProgram(this.programs.fade)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, layer.texture)
    gl.uniform1i(this.uniforms.fade.layer, 0)
    gl.uniform1f(this.uniforms.fade.alpha, alpha)
    gl.bindVertexArray(null)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    this.useCoverageBlending()
    gl.enable(gl.DEPTH_TEST)
  }

  private ensureFadeLayer(width: number, height: number): FadeLayer {
    const existing = this.fadeLayer
    if (existing?.width === width && existing.height === height) {
      return existing
    }
    if (existing) deleteFadeLayer(this.gl, existing)
    const layer = createFadeLayer(this.gl, width, height)
    this.fadeLayer = layer
    return layer
  }

  private drawRoundPass(
    range: DrawRange,
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    const count = rangeCount(this.counts.round, range)
    if (count === 0) return
    const gl = this.gl
    gl.useProgram(this.programs.round)
    gl.uniform2f(
      this.uniforms.round.offset,
      transform.offsetX,
      transform.offsetY,
    )
    gl.uniform1f(this.uniforms.round.scale, transform.scale)
    gl.uniform2f(this.uniforms.round.resolution, res[0], res[1])
    pointInstances(gl, this.buffers.round, rangeStart(this.counts.round, range))
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)
  }

  private drawTextPass(
    pass: InstancedPassBuffer,
    texture: WebGLTexture,
    layout: PassLayout,
    range: DrawRange,
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    const count = rangeCount(layout, range)
    if (count === 0) return
    const gl = this.gl
    gl.useProgram(this.programs.text)
    gl.uniform2f(
      this.uniforms.text.offset,
      transform.offsetX,
      transform.offsetY,
    )
    gl.uniform1f(this.uniforms.text.scale, transform.scale)
    gl.uniform2f(this.uniforms.text.resolution, res[0], res[1])
    gl.uniform1f(this.uniforms.text.dpr, this.dpr)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(this.uniforms.text.atlas, 0)
    pointInstances(gl, pass, rangeStart(layout, range))
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)
  }

  private drawLinePass(
    pass: { vao: WebGLVertexArrayObject },
    v: number,
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    if (v === 0) return
    const gl = this.gl
    gl.useProgram(this.programs.line)
    gl.uniform2f(
      this.uniforms.line.offset,
      transform.offsetX,
      transform.offsetY,
    )
    gl.uniform1f(this.uniforms.line.scale, transform.scale)
    gl.uniform2f(this.uniforms.line.resolution, res[0], res[1])
    gl.bindVertexArray(pass.vao)
    gl.drawArrays(gl.TRIANGLES, 0, v)
  }

  private drawConnectionPass(
    transform: { offsetX: number; offsetY: number; scale: number },
    res: [number, number],
  ) {
    const n = this.counts.connections
    if (n === 0) return
    const gl = this.gl
    gl.useProgram(this.programs.connection)
    gl.uniform2f(
      this.uniforms.connection.offset,
      transform.offsetX,
      transform.offsetY,
    )
    gl.uniform1f(this.uniforms.connection.scale, transform.scale)
    gl.uniform2f(this.uniforms.connection.resolution, res[0], res[1])
    gl.bindVertexArray(this.buffers.connections.vao)
    gl.drawArraysInstanced(
      gl.TRIANGLE_STRIP,
      0,
      (CONNECTION_SEGMENTS + 1) * 2,
      n,
    )
  }

  // --------------------------------------------------------------------------

  private ensureRound(count: number): Float32Array {
    if (count * QUAD_STRIDE_F <= this.roundData.length) return this.roundData
    const newCap = Math.max(64, count * 2)
    this.roundData = new Float32Array(newCap * QUAD_STRIDE_F)
    return this.roundData
  }
  private ensureText(count: number): Float32Array {
    if (count * TEXT_STRIDE_F <= this.textData.length) return this.textData
    const newCap = Math.max(256, count * 2)
    this.textData = new Float32Array(newCap * TEXT_STRIDE_F)
    return this.textData
  }
  private ensureConnections(count: number): Float32Array {
    if (count * CONNECTION_STRIDE_F <= this.connectionData.length)
      return this.connectionData
    const newCap = Math.max(256, count * 2)
    this.connectionData = new Float32Array(newCap * CONNECTION_STRIDE_F)
    return this.connectionData
  }
  private ensureLine(vertexCount: number): Float32Array {
    if (vertexCount * LINE_STRIDE_F <= this.lineData.length)
      return this.lineData
    const newCap = Math.max(1024, vertexCount * 2)
    this.lineData = new Float32Array(newCap * LINE_STRIDE_F)
    return this.lineData
  }

  dispose() {
    const gl = this.gl
    gl.deleteProgram(this.programs.round)
    gl.deleteProgram(this.programs.text)
    gl.deleteProgram(this.programs.fade)
    gl.deleteProgram(this.programs.grid)
    if (this.fadeLayer) deleteFadeLayer(gl, this.fadeLayer)
    gl.deleteProgram(this.programs.line)
    gl.deleteProgram(this.programs.connection)
    gl.deleteBuffer(this.buffers.cornerQuad)
    gl.deleteBuffer(this.buffers.connectionStrip)
    for (const pass of [
      this.buffers.round,
      this.buffers.headerText,
      this.buffers.fieldText,
      this.buffers.footerText,
      this.buffers.icon,
      this.buffers.connections,
      this.buffers.overlap,
    ]) {
      gl.deleteBuffer(pass.data)
      gl.deleteVertexArray(pass.vao)
    }
    gl.deleteTexture(this.headerAtlas.texture)
    gl.deleteTexture(this.fieldAtlas.texture)
    gl.deleteTexture(this.footerAtlas.texture)
    gl.deleteTexture(this.iconAtlas.texture)
  }
}

// Ordered by range, and selection last so it draws on top within its range.
function buildRenderNodes(data: DrawData): RenderNode[] {
  const grayed: RenderNode[] = []
  const dimmed: RenderNode[] = []
  const normal: RenderNode[] = []
  const selected: RenderNode[] = []

  for (const node of data.visible) {
    const flags = data.flags.get(node.id)
    if (!flags) continue
    const fullHeight = node.addressType === 'EOA' && node.fields.length === 0
    const isGroup = node.subnodes.length > 0
    const renderNode: RenderNode = {
      node,
      flags,
      z: 0,
      range: nodeRange(flags),
      visibleFields: getVisibleFields(node),
      rows: getRowLayout(node).rows,
      fullHeight,
      corner: fullHeight
        ? FULL_HEIGHT_CORNER_RADIUS
        : isGroup
          ? GROUP_CORNER_RADIUS
          : NODE_CORNER_RADIUS,
      headerH: fullHeight ? HEADER_HEIGHT : HEADER_HEIGHT - 4,
      isGroup,
    }

    if (renderNode.range === GRAYED_RANGE) grayed.push(renderNode)
    else if (renderNode.range === DIMMED_RANGE) dimmed.push(renderNode)
    else if (flags.isSelected) selected.push(renderNode)
    else normal.push(renderNode)
  }

  const ordered = [...grayed, ...dimmed, ...normal, ...selected]
  const maxIndex = Math.max(1, ordered.length - 1)
  for (let i = 0; i < ordered.length; i++) {
    const rn = ordered[i]
    if (rn) rn.z = 0.9 - (i / maxIndex) * 1.8
  }
  return ordered
}

function nodeRange(flags: NodeFlags): NodeRange {
  if (flags.isGrayedOut) return GRAYED_RANGE
  if (flags.isDimmed) return DIMMED_RANGE
  return OPAQUE_RANGE
}

function liveConnections(data: DrawData): ConnectionSpan[] {
  const spans: ConnectionSpan[] = []
  for (const node of data.visible) {
    const flags = data.flags.get(node.id)
    if (flags === undefined) continue
    for (const { field, index } of getVisibleFields(node)) {
      if (!isFieldConnectionLive(node, field, data.liveGroupTargets)) continue
      if (flags.fieldTargetHidden[index]) continue
      const target = data.visibleById.get(field.target)
      if (!target) continue
      spans.push({
        node,
        target,
        field,
        fieldIndex: index,
        isDashed:
          target.addressType === 'EOA' ||
          target.addressType === 'EOAPermissioned',
      })
    }
  }
  return spans
}

function isConnectionHighlighted(
  span: ConnectionSpan,
  data: DrawData,
): boolean {
  const flags = data.flags.get(span.node.id)
  if (flags === undefined) {
    throw new Error('Connection from a node without flags')
  }
  return flags.isSelected || flags.fieldHighlighted[span.fieldIndex] === 1
}

function connectionColor(span: ConnectionSpan, data: DrawData): RGBA {
  if (
    data.markUnreachableEntries &&
    !(span.node.isReachable && span.target.isReachable)
  ) {
    return GRAYED_CONNECTION_COLOR
  }
  if (data.enableDimming && data.anyNodeSelected) {
    return DIMMED_CONNECTION_COLOR
  }
  return COFFEE_400
}

// ============================================================================
// Per-instance writers
// ============================================================================

function writeConnection(
  out: Float32Array,
  i: number,
  span: ConnectionSpan,
  width: number,
  color: RGBA,
): number {
  const { from, to } = span.field.connection
  const b = i * CONNECTION_STRIDE_F
  out[b] = from.x
  out[b + 1] = from.y
  out[b + 2] = to.x
  out[b + 3] = to.y
  out[b + 4] = from.x + controlOffset(from.direction)
  out[b + 5] = to.x + controlOffset(to.direction)
  out[b + 6] = color[0]
  out[b + 7] = color[1]
  out[b + 8] = color[2]
  out[b + 9] = color[3]
  out[b + 10] = width
  out[b + 11] = span.isDashed ? 1 : 0
  return i + 1
}

function controlOffset(direction: 'left' | 'right'): number {
  return direction === 'left'
    ? -CONNECTION_CONTROL_OFFSET
    : CONNECTION_CONTROL_OFFSET
}

// (t, side) pairs along the curve, two per sample, for a triangle strip.
function createConnectionStrip(gl: WebGL2RenderingContext): WebGLBuffer {
  const vertices = new Float32Array((CONNECTION_SEGMENTS + 1) * 4)
  for (let i = 0; i <= CONNECTION_SEGMENTS; i++) {
    const t = i / CONNECTION_SEGMENTS
    vertices[i * 4] = t
    vertices[i * 4 + 1] = 1
    vertices[i * 4 + 2] = t
    vertices[i * 4 + 3] = -1
  }
  const strip = mustCreateBuffer(gl)
  gl.bindBuffer(gl.ARRAY_BUFFER, strip)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  return strip
}

function writeRound(
  out: Float32Array,
  i: number,
  x: number,
  y: number,
  w: number,
  h: number,
  color: RGBA,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number,
  border: number,
  z: number,
  ring: RGBA,
) {
  const base = i * QUAD_STRIDE_F
  out[base] = x
  out[base + 1] = y
  out[base + 2] = w
  out[base + 3] = h
  out[base + 4] = color[0]
  out[base + 5] = color[1]
  out[base + 6] = color[2]
  out[base + 7] = color[3]
  out[base + 8] = rTL
  out[base + 9] = rTR
  out[base + 10] = rBR
  out[base + 11] = rBL
  out[base + 12] = border
  out[base + 13] = z
  out[base + 14] = ring[0]
  out[base + 15] = ring[1]
  out[base + 16] = ring[2]
  out[base + 17] = ring[3]
}

function writeTextQuad(
  out: Float32Array,
  i: number,
  x: number,
  y: number,
  w: number,
  h: number,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  color: RGBA,
  z: number,
) {
  const base = i * TEXT_STRIDE_F
  out[base] = x
  out[base + 1] = y
  out[base + 2] = w
  out[base + 3] = h
  out[base + 4] = u0
  out[base + 5] = v0
  out[base + 6] = u1
  out[base + 7] = v1
  out[base + 8] = color[0]
  out[base + 9] = color[1]
  out[base + 10] = color[2]
  out[base + 11] = color[3]
  out[base + 12] = z
}

function writeStringInstances(
  out: Float32Array,
  startInstance: number,
  text: string,
  cursorX: number,
  baselineY: number,
  atlas: FontAtlas,
  color: RGBA,
  maxX: number,
  z: number,
): number {
  // Truncates with "…" when the string doesn't fit in [cursorX, maxX], like
  // CSS text-overflow: ellipsis.
  const ellipsis = atlas.getGlyph('…')
  let totalWidth = 0
  for (const ch of text) totalWidth += atlas.getGlyph(ch).advance
  const fits = cursorX + totalWidth <= maxX
  const prefixLimit = fits ? maxX : maxX - ellipsis.advance

  let x = cursorX
  let written = 0
  const quadY = baselineY - atlas.baselineOffset
  for (const ch of text) {
    const g = atlas.getGlyph(ch)
    if (x + g.advance > prefixLimit) break
    writeTextQuad(
      out,
      startInstance + written,
      x,
      quadY,
      atlas.cellW,
      atlas.cellH,
      g.u0,
      g.v0,
      g.u1,
      g.v1,
      color,
      z,
    )
    written++
    x += g.advance
  }

  if (!fits && x + ellipsis.advance <= maxX) {
    writeTextQuad(
      out,
      startInstance + written,
      x,
      quadY,
      atlas.cellW,
      atlas.cellH,
      ellipsis.u0,
      ellipsis.v0,
      ellipsis.u1,
      ellipsis.v1,
      color,
      z,
    )
    written++
  }
  return written
}

function measureString(text: string, atlas: FontAtlas): number {
  let w = 0
  for (const ch of text) w += atlas.getGlyph(ch).advance
  return w
}

// ============================================================================
// Curves and perimeters
// ============================================================================

// Ribbon writer for the dashed perimeter walker.
function emitRibbonQuad(
  out: Float32Array,
  startVertex: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  width: number,
  color: RGBA,
): number {
  let dx = bx - ax
  let dy = by - ay
  const lenSq = dx * dx + dy * dy
  if (lenSq < 1e-12) return 0
  const invLen = 1 / Math.sqrt(lenSq)
  dx *= invLen
  dy *= invLen
  const halfW = width * 0.5
  const px = -dy * halfW
  const py = dx * halfW
  const cr = color[0]
  const cg = color[1]
  const cb = color[2]
  const ca = color[3]
  let b = startVertex * LINE_STRIDE_F
  out[b] = ax + px
  out[b + 1] = ay + py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  b += 6
  out[b] = ax - px
  out[b + 1] = ay - py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  b += 6
  out[b] = bx + px
  out[b + 1] = by + py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  b += 6
  out[b] = ax - px
  out[b + 1] = ay - py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  b += 6
  out[b] = bx - px
  out[b + 1] = by - py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  b += 6
  out[b] = bx + px
  out[b + 1] = by + py
  out[b + 2] = cr
  out[b + 3] = cg
  out[b + 4] = cb
  out[b + 5] = ca
  return 6
}

// Walks a polyline, emitting ribbon quads only inside "on" portions of a
// dash pattern. Arc length is accumulated globally so the pattern continues
// smoothly across segment boundaries.
function emitDashedRibbon(
  out: Float32Array,
  startVertex: number,
  points: readonly { x: number; y: number }[],
  width: number,
  color: RGBA,
  dashOn: number,
  dashOff: number,
): number {
  const period = dashOn + dashOff
  let cumStart = 0
  let v = 0
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i] as { x: number; y: number }
    const b = points[i + 1] as { x: number; y: number }
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (segLen === 0) continue
    const segEnd = cumStart + segLen
    let cursor = cumStart
    while (cursor < segEnd) {
      const inPeriod = cursor - Math.floor(cursor / period) * period
      const onPhase = inPeriod < dashOn
      const remainingInPhase = onPhase ? dashOn - inPeriod : period - inPeriod
      const advance = Math.min(remainingInPhase, segEnd - cursor)
      if (onPhase) {
        const s = (cursor - cumStart) / segLen
        const e = (cursor + advance - cumStart) / segLen
        const ax = a.x + s * (b.x - a.x)
        const ay = a.y + s * (b.y - a.y)
        const bx = a.x + e * (b.x - a.x)
        const by = a.y + e * (b.y - a.y)
        v += emitRibbonQuad(out, startVertex + v, ax, ay, bx, by, width, color)
      }
      cursor += advance
    }
    cumStart = segEnd
  }
  return v
}

// Samples points along the perimeter of a rounded rect (clockwise). Each
// corner becomes PERIMETER_SAMPLES_PER_CORNER arc points; edges are straight
// line segments via just two endpoints.
function roundedRectPerimeter(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): { x: number; y: number }[] {
  const radius = Math.min(r, Math.min(w, h) / 2)
  const pts: { x: number; y: number }[] = []

  pts.push({ x: x + radius, y: y })
  pts.push({ x: x + w - radius, y: y })
  pushArc(pts, x + w - radius, y + radius, radius, -Math.PI / 2, 0)
  pts.push({ x: x + w, y: y + h - radius })
  pushArc(pts, x + w - radius, y + h - radius, radius, 0, Math.PI / 2)
  pts.push({ x: x + radius, y: y + h })
  pushArc(pts, x + radius, y + h - radius, radius, Math.PI / 2, Math.PI)
  pts.push({ x: x, y: y + radius })
  pushArc(pts, x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
  // Close.
  pts.push({ x: x + radius, y: y })
  return pts
}

function pushArc(
  out: { x: number; y: number }[],
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) {
  const steps = PERIMETER_SAMPLES_PER_CORNER
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const a = start + (end - start) * t
    out.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
  }
}

// ============================================================================
// Color & flag helpers
// ============================================================================

function withAlpha(c: RGBA, a: number): RGBA {
  return [c[0], c[1], c[2], a]
}

function desaturate(c: RGBA): RGBA {
  const g = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114
  return [g, g, g, c[3]]
}

function cssRgbToRgba(css: string): RGBA {
  const open = css.indexOf('(')
  const close = css.indexOf(')')
  if (open === -1 || close === -1) return [1, 1, 1, 1]
  const inner = css.substring(open + 1, close)
  const parts = inner.split(',')
  if (parts.length < 3) return [1, 1, 1, 1]
  const r = Number.parseFloat((parts[0] as string).trim()) / 255
  const g = Number.parseFloat((parts[1] as string).trim()) / 255
  const b = Number.parseFloat((parts[2] as string).trim()) / 255
  return [r, g, b, 1]
}

function isRowHighlighted(rn: RenderNode, row: number): boolean {
  for (const index of (rn.rows[row] as NodeRow).fieldIndices) {
    if (rn.flags.fieldHighlighted[index] === 1) return true
  }
  return false
}

// Values keep their own entry, but a compressed row hands several of them the
// same visible row, so their dots and links stack up on one anchor.
function getVisibleFields(node: Node): VisibleField[] {
  const { rows } = getRowLayout(node)
  const visibleFields: VisibleField[] = []
  for (let row = 0; row < rows.length; row++) {
    for (const index of (rows[row] as NodeRow).fieldIndices) {
      const field = node.fields[index]
      if (!field) continue
      visibleFields.push({ field, index, visibleRow: row })
    }
  }
  return visibleFields
}

// ============================================================================
// Data build
// ============================================================================

function buildDrawData(
  nodes: readonly Node[],
  containers: GroupContainer[],
  hidden: ReadonlySet<string>,
  liveGroupTargets: ReadonlyMap<string, ReadonlySet<string>>,
  selected: readonly string[],
  enableDimming: boolean,
  highlightOverlapping: boolean,
  markUnreachableEntries: boolean,
): DrawData {
  const selectedSet = new Set(selected)
  const visible: Node[] = []
  for (const node of nodes) {
    if (!hidden.has(node.id)) {
      visible.push(node)
    }
  }
  const visibleById = topLevelByDescendant(visible)

  const overlappingIds = highlightOverlapping
    ? computeOverlappingIds(visible)
    : new Set<string>()

  const anyNodeSelected = selected.length > 0
  const highlightedSet = new Set<string>(selectedSet)
  if (enableDimming && anyNodeSelected) {
    for (const node of visible) {
      if (!selectedSet.has(node.id)) continue
      for (const { field } of getVisibleFields(node)) {
        if (!isFieldConnectionLive(node, field, liveGroupTargets)) continue
        if (hidden.has(field.target)) continue
        highlightedSet.add(field.target)
      }
    }
    for (const node of visible) {
      if (highlightedSet.has(node.id)) continue
      for (const { field } of getVisibleFields(node)) {
        if (!isFieldConnectionLive(node, field, liveGroupTargets)) continue
        if (hidden.has(field.target)) continue
        if (selectedSet.has(field.target)) {
          highlightedSet.add(node.id)
        }
      }
    }
  }

  const flags = new Map<string, NodeFlags>()
  for (const node of visible) {
    const fieldCount = node.fields.length
    const fieldHighlighted = new Uint8Array(fieldCount)
    const fieldTargetHidden = new Uint8Array(fieldCount)
    for (let i = 0; i < node.fields.length; i++) {
      const field = node.fields[i]
      if (!field) continue
      if (selectedSet.has(field.target)) {
        fieldHighlighted[i] = 1
      }
      if (hidden.has(field.target)) fieldTargetHidden[i] = 1
    }
    flags.set(node.id, {
      isSelected: selectedSet.has(node.id),
      isDimmed:
        enableDimming && anyNodeSelected && !highlightedSet.has(node.id),
      isGrayedOut: markUnreachableEntries && !node.isReachable,
      isOverlapping: overlappingIds.has(node.id),
      fieldHighlighted,
      fieldTargetHidden,
    })
  }

  return {
    visible,
    visibleById,
    flags,
    containers,
    selectedContainers: new Set(
      containers
        .filter((group) => selectedSet.has(group.id))
        .map((group) => group.id),
    ),
    enableDimming,
    markUnreachableEntries,
    anyNodeSelected,
    liveGroupTargets,
  }
}

function computeOverlappingIds(nodes: readonly Node[]): Set<string> {
  const overlapping = new Set<string>()
  if (nodes.length < 2) return overlapping
  const sorted = nodes.slice().sort((a, b) => a.box.x - b.box.x)
  const active: Node[] = []
  for (const node of sorted) {
    const left = node.box.x
    const top = node.box.y
    const bottom = top + node.box.height
    for (let k = active.length - 1; k >= 0; k--) {
      const candidate = active[k]
      if (!candidate) continue
      if (candidate.box.x + candidate.box.width <= left) {
        active[k] = active[active.length - 1] as Node
        active.pop()
        continue
      }
      if (
        candidate.box.y < bottom &&
        candidate.box.y + candidate.box.height > top
      ) {
        overlapping.add(node.id)
        overlapping.add(candidate.id)
      }
    }
    active.push(node)
  }
  return overlapping
}

function getGridCellSize(scale: number): number {
  if (scale < 0.25) return 180
  if (scale < 0.8) return 60
  return 20
}

// ============================================================================
// React component
// ============================================================================

export function NodesAndConnectionsWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const rafRef = useRef<number | null>(null)
  const dataRef = useRef<DrawData | null>(null)

  const nodes = useStore((s) => s.nodes)
  const selected = useStore((s) => s.selected)
  const enableDimming = useStore(
    ({ userPreferences }) => userPreferences.enableDimming,
  )
  const highlightOverlapping = useStore(
    ({ userPreferences }) => userPreferences.highlightOverlapping !== false,
  )
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )

  const graph = useMemo(() => buildRenderGraph(nodes), [nodes])

  const data = useMemo(
    () =>
      buildDrawData(
        graph.nodes,
        graph.containers,
        graph.hidden,
        graph.liveGroupTargets,
        selected,
        enableDimming,
        highlightOverlapping,
        markUnreachableEntries,
      ),
    [
      graph,
      selected,
      enableDimming,
      highlightOverlapping,
      markUnreachableEntries,
    ],
  )
  dataRef.current = data

  const scheduleDraw = useRef(() => {})
  scheduleDraw.current = () => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const renderer = rendererRef.current
      const canvas = canvasRef.current
      const d = dataRef.current
      if (!renderer || !canvas || !d) return
      const rect = canvas.getBoundingClientRect()
      const transform = useStore.getState().transform
      renderer.render(
        d,
        transform,
        rect.width,
        rect.height,
        window.devicePixelRatio || 1,
      )
    })
  }

  // Init.
  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
      depth: true,
      premultipliedAlpha: true,
    })
    if (!gl) {
      console.error('WebGL2 not supported in this browser')
      return
    }
    const dpr = window.devicePixelRatio || 1
    WebGLRenderer.create(gl, dpr)
      .then((renderer) => {
        if (cancelled) {
          renderer.dispose()
          return
        }
        rendererRef.current = renderer
        scheduleDraw.current()
      })
      .catch((e) => {
        console.error('WebGL renderer init failed', e)
      })
    return () => {
      cancelled = true
      rendererRef.current?.dispose()
      rendererRef.current = null
    }
  }, [])

  // Redraw when derived data changes.
  useEffect(() => {
    scheduleDraw.current()
  }, [data])

  // Redraw on any store change (covers pan/zoom without going through React).
  useEffect(() => {
    const unsub = useStore.subscribe(() => scheduleDraw.current())
    return () => {
      unsub()
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => scheduleDraw.current())
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
