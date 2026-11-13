import { assert } from '@l2beat/shared-pure'
import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ApiAddressType } from '../../../../api/types'
import { ADDRESS_ICON_COMPONENTS } from '../../../../components/AddressIcon'
import {
  IconArrowHeadLeft,
  IconArrowHeadRight,
} from '../../../../icons/IconArrowHead'
import { IconInitial } from '../../../../icons/IconInitial'
import { useTheme } from '../../../../theme'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  MAX_ZOOM,
} from '../store/utils/constants'
import {
  buildRenderGraph,
  type GroupContainer,
  isFieldConnectionLive,
} from '../store/utils/renderGraph'
import { getRowLayout, type NodeRow } from '../store/utils/rows'
import { topLevelByDescendant } from '../store/utils/subnodes'
import { getColor } from './colors/colors'
import {
  DARK_GRAPH_PALETTE,
  type GraphPalette,
  HEADER_INITIAL,
  HEADER_TEMPLATE,
  HEADER_TEXT_ON_DARK,
  HEADER_TEXT_ON_LIGHT,
  HEADER_UNVERIFIED,
  LIGHT_GRAPH_PALETTE,
  type RGBA,
  TEXT_ON_ACCENT,
} from './colors/graphPalette'

// ============================================================================
// Constants
// ============================================================================

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
const NODE_BORDER_WIDTH = 1
// The arrow glyph spans 3..13 of its 16-unit cell, see IconArrowHead. Edges
// stop at its base so the line never shows past the tip.
const ARROW_HEAD_CELL = 16
const ARROW_HEAD_TIP = 13 / 16
const ARROW_HEAD_LENGTH = (10 / 16) * ARROW_HEAD_CELL
const HEADER_BADGE_STEP = 11
const HIGHLIGHTED_ROW_INSET = 3
const HIGHLIGHTED_ROW_RADIUS = 4
// Below this zoom field text is under 5 px and names under 6 px, so all text
// goes at once and the overview shows shapes with chain captions.
const NODE_DETAIL_MIN_SCALE = 0.4

export function drawsNodeDetail(scale: number): boolean {
  return scale >= NODE_DETAIL_MIN_SCALE
}

// Below the detail zoom no text is drawn, so the atlases stay at its size.
function textZoomFor(scale: number): number {
  assert(scale > 0, 'Zoom must be positive')
  assert(scale <= MAX_ZOOM, 'Zoom must not exceed the maximum')
  return Math.max(scale, NODE_DETAIL_MIN_SCALE)
}

const TEXT_RASTER_SETTLE_MS = 150

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

// Each curve gets the fewest segments that keep its chords within the
// tolerance of the true curve on screen (Wang's formula), up to the strip's
// length. Long edges at full zoom need ~100; short ones need a handful.
const CONNECTION_SEGMENTS_MAX = 128
const CONNECTION_CHORD_TOLERANCE_DEVICE_PX = 0.25
const GRID_DOT_RADIUS_PER_CELL = 0.05
// Control points sit half the horizontal gap out, so a long edge leaves and
// reaches its nodes level instead of bending sharply at the arrowhead.
const CONNECTION_CONTROL_OFFSET_MIN = 50
const CONNECTION_CONTROL_OFFSET_MAX = 200
const CONNECTION_CONTROL_GAP_SHARE = 0.5
const DASH_ON_WORLD = 5
const DASH_OFF_WORLD = 5
const PERIMETER_SAMPLES_PER_CORNER = 8

// Floats per instance for each pipeline.
const QUAD_STRIDE_F = 14 // pos.xy, size.xy, color.rgba, radii.xyzw, border, z
const TEXT_STRIDE_F = 14 // pos.xy, size.xy, uv.xyzw, color.rgba, z, channel
const LINE_STRIDE_F = 6 // pos.xy, color.rgba
const CONNECTION_STRIDE_F = 12 // from.xy, to.xy, controlX.xy, color.rgba, width, dashed
const CONNECTION_WIDTH = 1.5
const HIGHLIGHTED_CONNECTION_WIDTH = 2.5
// Zoomed out, world-space edges would thin to a fraction of a pixel and fade.
const CONNECTION_MIN_STROKE_PX = 1
const CONNECTION_MIN_INK_RATIO = 0.6

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
  palette: GraphPalette
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

type IconAtlasId =
  | ApiAddressType
  | 'InitialCircle'
  | 'ArrowHeadLeft'
  | 'ArrowHeadRight'

interface AtlasGlyph {
  u0: number
  v0: number
  u1: number
  v1: number
  advance: number
}

// Texture has a static ASCII slab and an LRU slab for runtime glyphs.
interface FontAtlas {
  refSize: number
  cellW: number
  cellH: number
  sampling: TextSampling
  // Font ascent and descent in world units, for placing text in a CSS line box.
  ascent: number
  descent: number
  getGlyph: (ch: string) => AtlasGlyph
  kerning: (left: string, right: string) => number
  // Which of the atlas's four coverage masks Chrome would use for a color.
  coverageChannel: (color: RGBA) => number
}

// How the text shader finds a glyph's raster in an atlas, see TEXT_VS.
interface TextSampling {
  texture: WebGLTexture
  subpixelSteps: number
  subpixelStepU: number
  cellPen: [number, number]
}

interface IconAtlas {
  sampling: TextSampling
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
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
out vec4 v_color;
out vec2 v_local;
out vec2 v_halfSize;
out vec4 v_radii;
out float v_border;
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
}`

const ROUND_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in vec2 v_local;
in vec2 v_halfSize;
in vec4 v_radii;
in float v_border;
out vec4 fragColor;
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
  fragColor = vec4(v_color.rgb, v_color.a * alpha);
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
uniform vec3 u_background;
out vec4 fragColor;
// The layer fades toward the canvas color rather than turning see-through, so
// edges running under a faded node stay hidden like under an opaque one.
void main() {
  vec4 layer = texelFetch(u_layer, ivec2(gl_FragCoord.xy), 0);
  fragColor = vec4(layer.rgb * u_alpha + u_background * layer.a * (1.0 - u_alpha), layer.a);
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
layout(location = 6) in float i_channel;
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
uniform float u_dpr;
// Glyph atlases hold each glyph at u_subpixelSteps offsets, u_subpixelStepU
// apart, with the pen at u_cellPen (world units) in the cell. Icons use 1, 0
// and (0, 0).
uniform float u_subpixelSteps;
uniform float u_subpixelStepU;
uniform vec2 u_cellPen;
out vec2 v_uv;
out vec4 v_color;
flat out vec4 v_channelMask;
void main() {
  // Like Chrome: the pen snaps to a fraction of a device pixel across and to a
  // whole one down, so the atlas maps texel to pixel instead of smearing.
  vec2 penPx = (i_pos * u_scale + u_offset) * u_dpr;
  float stepsX = floor(penPx.x * u_subpixelSteps + 0.5);
  float wholeX = floor(stepsX / u_subpixelSteps);
  float subpixelStep = stepsX - wholeX * u_subpixelSteps;
  // Scaled like the cell, so text stays put while the atlas is for another zoom.
  vec2 cellPx = vec2(wholeX, floor(penPx.y + 0.5)) - u_cellPen * u_scale * u_dpr;
  vec2 screen = cellPx / u_dpr + a_corner * i_size * u_scale;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, i_z, 1.0);
  v_uv = mix(i_uv.xy, i_uv.zw, a_corner) + vec2(subpixelStep * u_subpixelStepU, 0.0);
  v_color = i_color;
  v_channelMask = vec4(equal(ivec4(int(i_channel)), ivec4(0, 1, 2, 3)));
}`

const TEXT_FS = `#version 300 es
precision mediump float;
// fp16 mediump cannot address single texels across a 1000+ px wide atlas.
in highp vec2 v_uv;
in vec4 v_color;
flat in vec4 v_channelMask;
uniform sampler2D u_atlas;
out vec4 fragColor;
void main() {
  float a = dot(texture(u_atlas, v_uv), v_channelMask);
  fragColor = vec4(v_color.rgb, v_color.a * a);
}`

// One instance per connection. The strip's vertices carry only (sample, side),
// the curve is evaluated here, so moving a node rewrites a few floats per
// connection instead of re-tessellating every curve on the CPU. Samples past
// the curve's own segment count collapse onto its end, so the rasterizer drops
// their triangles.
const CONNECTION_VS = `#version 300 es
layout(location = 0) in vec2 a_vertex; // sample, side
layout(location = 1) in vec2 i_from;
layout(location = 2) in vec2 i_to;
layout(location = 3) in vec2 i_controlX;
layout(location = 4) in vec4 i_color;
layout(location = 5) in vec2 i_stroke; // width, dashed
uniform vec2 u_offset;
uniform float u_scale;
uniform vec2 u_resolution;
uniform float u_dpr;
out vec4 v_color;
out float v_arc;
out float v_across;
flat out float v_capRadius;
flat out float v_dashed;
const float SEGMENTS_MAX = ${CONNECTION_SEGMENTS_MAX}.0;
const float CHORD_TOLERANCE_PX = ${CONNECTION_CHORD_TOLERANCE_DEVICE_PX};
// 8-point Gauss-Legendre: nodes +-x on [-1, 1] and their weights.
const float GAUSS_NODES[4] = float[4](
  0.1834346424956498, 0.5255324099163290, 0.7966664774136267,
  0.9602898564975363);
const float GAUSS_WEIGHTS[4] = float[4](
  0.3626837833783620, 0.3137066458778873, 0.2223810344533745,
  0.1012285362903763);
const float MIN_STROKE_PX = ${CONNECTION_MIN_STROKE_PX}.0;
const float MIN_INK_RATIO = ${CONNECTION_MIN_INK_RATIO};
vec2 control1() { return vec2(i_controlX.x, i_from.y); }
vec2 control2() { return vec2(i_controlX.y, i_to.y); }
vec2 bezier(float t) {
  float mt = 1.0 - t;
  vec2 p1 = control1();
  vec2 p2 = control2();
  return mt * mt * mt * i_from + 3.0 * mt * mt * t * p1 +
    3.0 * mt * t * t * p2 + t * t * t * i_to;
}
vec2 bezierTangent(float t) {
  float mt = 1.0 - t;
  vec2 p1 = control1();
  vec2 p2 = control2();
  return 3.0 * mt * mt * (p1 - i_from) + 6.0 * mt * t * (p2 - p1) +
    3.0 * t * t * (i_to - p2);
}
// Wang's formula: a cubic split into n equal-t chords strays at most
// 3/4 * M / n^2 from the curve, M being its largest second difference.
float segmentCount() {
  vec2 p1 = control1();
  vec2 p2 = control2();
  float secondDifference = max(
    length(i_from - 2.0 * p1 + p2), length(p1 - 2.0 * p2 + i_to));
  float secondDifferencePx = secondDifference * u_scale * u_dpr;
  float n = ceil(sqrt(0.75 * secondDifferencePx / CHORD_TOLERANCE_PX));
  return clamp(n, 1.0, SEGMENTS_MAX);
}
float gaussArcLength(float start, float end) {
  float center = 0.5 * (start + end);
  float halfWidth = 0.5 * (end - start);
  float sum = 0.0;
  for (int k = 0; k < 4; k++) {
    float offset = halfWidth * GAUSS_NODES[k];
    sum += GAUSS_WEIGHTS[k] * (
      length(bezierTangent(center + offset)) +
      length(bezierTangent(center - offset)));
  }
  return halfWidth * sum;
}
// Where x'(t), a quadratic, is zero inside (0, 1), sorted; -1 marks no root.
// y'(t) has none there, since each control point shares its endpoint's y.
vec2 tangentXRoots() {
  float d0 = i_controlX.x - i_from.x;
  float d1 = i_controlX.y - i_controlX.x;
  float d2 = i_to.x - i_controlX.y;
  float a = d0 - 2.0 * d1 + d2;
  float b = 2.0 * (d1 - d0);
  vec2 roots = vec2(-1.0);
  float discriminant = b * b - 4.0 * a * d0;
  if (discriminant >= 0.0) {
    // Stable form: no cancellation in 32-bit floats when a is tiny, and a
    // linear x'(t) (a = 0) still yields its one root.
    float q = -0.5 * (b + (b < 0.0 ? -1.0 : 1.0) * sqrt(discriminant));
    if (q != 0.0) roots.x = d0 / q;
    if (a != 0.0) roots.y = q / a;
  }
  return vec2(min(roots.x, roots.y), max(roots.x, roots.y));
}
// Constant cost per vertex, and independent of the segment count, so dashes
// stay put while zooming changes the tessellation. Curves between close
// nodes reverse, and |B'| dips sharply there, which one Gauss rule across
// the dip mis-measures; splitting at the reversals keeps each piece smooth.
float arcLength(float t) {
  vec2 roots = tangentXRoots();
  float first = clamp(roots.x, 0.0, t);
  float second = clamp(roots.y, 0.0, t);
  return gaussArcLength(0.0, first) + gaussArcLength(first, second) +
    gaussArcLength(second, t);
}
void main() {
  float segments = segmentCount();
  float t = min(a_vertex.x, segments) / segments;
  vec2 tangent = bezierTangent(t);
  float tangentLength = length(tangent);
  vec2 normal = tangentLength > 1e-6
    ? vec2(-tangent.y, tangent.x) / tangentLength
    : vec2(0.0, 1.0);
  float strokeWidth = max(i_stroke.x, MIN_STROKE_PX / u_scale);
  // A floored stroke would carry more ink than the edge has, so it gives the
  // extra back as transparency, down to a floor that keeps it visible.
  float inkRatio = i_stroke.x / strokeWidth;
  vec2 world = bezier(t) + normal * (strokeWidth * 0.5 * a_vertex.y);
  vec2 screen = world * u_scale + u_offset;
  vec2 ndc = (screen / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  v_color = vec4(i_color.rgb, i_color.a * max(inkRatio, MIN_INK_RATIO));
  // Dash caps keep the edge's own width; the widened stroke's would fill the
  // gaps when zoomed out.
  v_capRadius = i_stroke.x * 0.5;
  v_across = strokeWidth * 0.5 * a_vertex.y;
  v_dashed = i_stroke.y;
  // Collapsed samples only form zero-area triangles, so skip their arc.
  bool collapsed = a_vertex.x > segments;
  v_arc = i_stroke.y > 0.5 && !collapsed ? arcLength(t) : 0.0;
}`

// Dashes get round caps that reach into the gaps, like SVG's round linecap.
const CONNECTION_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in float v_arc;
in float v_across;
flat in float v_capRadius;
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
      float d = length(vec2(along, v_across)) - v_capRadius;
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

const ATLAS_SLOT_COLUMNS = 8
const ATLAS_STATIC_ROWS = 12 // 95 ASCII glyphs + 1 fallback fit in 96 slots
const ATLAS_DYNAMIC_ROWS = 12
const ATLAS_FALLBACK_CH = '�'
const ATLAS_CELL_PADDING_PX = 2
// A slot holds its glyph at this many offsets within a device pixel, so every
// quad starts on a device pixel and the text still keeps its true advances.
const GLYPH_SUBPIXEL_STEPS = 4

interface AtlasGeometry {
  pixelsPerUnit: number
  cellPxW: number
  cellPxH: number
  slotPxW: number
  atlasPxW: number
  atlasPxH: number
  baselinePxY: number
}

function buildFontAtlas(
  gl: WebGL2RenderingContext,
  font: FontSpec,
  pixelsPerUnit: number,
): FontAtlas {
  // One extra pixel for the largest subpixel offset.
  const cellPxW = Math.ceil(
    font.size * pixelsPerUnit + ATLAS_CELL_PADDING_PX * 2 + 1,
  )
  const cellPxH = Math.ceil(
    font.size * pixelsPerUnit * 1.6 + ATLAS_CELL_PADDING_PX * 2,
  )
  const slotPxW = cellPxW * GLYPH_SUBPIXEL_STEPS
  const atlasPxW = slotPxW * ATLAS_SLOT_COLUMNS
  const staticPxH = cellPxH * ATLAS_STATIC_ROWS
  const atlasPxH = staticPxH + cellPxH * ATLAS_DYNAMIC_ROWS

  const initCanvas = newFontCanvas(font, pixelsPerUnit, atlasPxW, staticPxH)
  const initCtx = initCanvas.getContext('2d') as CanvasRenderingContext2D
  // The font's ascent rather than one glyph's, so taller glyphs like "$" or
  // "[" stay inside their cell instead of bleeding into the one above.
  const metrics = initCtx.measureText('Mg')
  const ascentPx = metrics.fontBoundingBoxAscent * pixelsPerUnit
  const descentPx = metrics.fontBoundingBoxDescent * pixelsPerUnit
  // A whole row, as the shader puts the baseline on a whole device pixel.
  const baselinePxY = Math.ceil(ascentPx) + ATLAS_CELL_PADDING_PX
  if (baselinePxY + descentPx > cellPxH) {
    throw new Error('Font does not fit its atlas cell', { cause: font })
  }
  const geometry: AtlasGeometry = {
    pixelsPerUnit,
    cellPxW,
    cellPxH,
    slotPxW,
    atlasPxW,
    atlasPxH,
    baselinePxY,
  }

  const glyphs = new Map<string, AtlasGlyph>()
  const coverage = rasterizeCoverage(initCtx, atlasPxW, staticPxH, () => {
    for (let i = 0; i < ATLAS_SLOT_COLUMNS * ATLAS_STATIC_ROWS; i++) {
      const ch = i < 95 ? String.fromCharCode(32 + i) : ATLAS_FALLBACK_CH
      const slotPxX = (i % ATLAS_SLOT_COLUMNS) * slotPxW
      const slotPxY = Math.floor(i / ATLAS_SLOT_COLUMNS) * cellPxH
      rasterizeSlot(initCtx, ch, slotPxX, slotPxY, geometry)
      const advance = initCtx.measureText(ch).width
      glyphs.set(ch, slotGlyph(slotPxX, slotPxY, advance, geometry))
    }
  })
  assert(glyphs.size === 96, 'Static atlas slab must hold 96 glyphs')
  const texture = createCoverageTexture(gl, atlasPxW, atlasPxH, coverage)
  const scratchCanvas = newFontCanvas(font, pixelsPerUnit, slotPxW, cellPxH)
  const scratchCtx = scratchCanvas.getContext('2d') as CanvasRenderingContext2D

  return {
    refSize: font.size,
    cellW: cellPxW / pixelsPerUnit,
    cellH: cellPxH / pixelsPerUnit,
    sampling: {
      texture,
      subpixelSteps: GLYPH_SUBPIXEL_STEPS,
      subpixelStepU: cellPxW / atlasPxW,
      cellPen: [
        ATLAS_CELL_PADDING_PX / pixelsPerUnit,
        baselinePxY / pixelsPerUnit,
      ],
    },
    ascent: ascentPx / pixelsPerUnit,
    descent: descentPx / pixelsPerUnit,
    getGlyph: createGlyphCache(gl, texture, scratchCtx, geometry, glyphs),
    kerning: createKerning(scratchCtx),
    coverageChannel: createCoverageChannelLookup(scratchCtx, geometry),
  }
}

// Map iteration order = LRU order; oldest is `keys().next()`, newest is the
// last `set`. Touching = delete + reinsert.
function createGlyphCache(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  scratchCtx: CanvasRenderingContext2D,
  geometry: AtlasGeometry,
  glyphs: Map<string, AtlasGlyph>,
): (ch: string) => AtlasGlyph {
  const fallback = glyphs.get(ATLAS_FALLBACK_CH) as AtlasGlyph
  const freeSlots: [number, number][] = []
  for (let r = ATLAS_DYNAMIC_ROWS - 1; r >= 0; r--) {
    for (let c = ATLAS_SLOT_COLUMNS - 1; c >= 0; c--) {
      const slotPxY = (ATLAS_STATIC_ROWS + r) * geometry.cellPxH
      freeSlots.push([c * geometry.slotPxW, slotPxY])
    }
  }
  const occupiedSlots = new Map<string, [number, number]>()
  const { slotPxW, cellPxH } = geometry

  return (ch: string): AtlasGlyph => {
    const cached = glyphs.get(ch)
    if (cached) {
      const slot = occupiedSlots.get(ch)
      if (slot) {
        occupiedSlots.delete(ch)
        occupiedSlots.set(ch, slot)
      }
      return cached
    }
    const advance = scratchCtx.measureText(ch).width
    if (advance === 0) {
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
    const [slotPxX, slotPxY] = slot
    const coverage = rasterizeCoverage(scratchCtx, slotPxW, cellPxH, () =>
      rasterizeSlot(scratchCtx, ch, 0, 0, geometry),
    )
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      slotPxX,
      slotPxY,
      slotPxW,
      cellPxH,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      coverage,
    )
    const glyph = slotGlyph(slotPxX, slotPxY, advance, geometry)
    glyphs.set(ch, glyph)
    return glyph
  }
}

// Kerning is what a pair measures beyond its two advances. Drawing glyph by
// glyph loses it, which shows most in pairs like "To" and "Tr".
function createKerning(
  ctx: CanvasRenderingContext2D,
): (left: string, right: string) => number {
  const pairs = new Map<string, number>()
  return (left: string, right: string): number => {
    const pair = left + right
    const cached = pairs.get(pair)
    if (cached !== undefined) return cached
    const kerning =
      ctx.measureText(pair).width -
      ctx.measureText(left).width -
      ctx.measureText(right).width
    pairs.set(pair, kerning)
    return kerning
  }
}

// Chrome rasterizes a glyph thinner the darker its color, in four luminance
// buckets, so a glyph drawn white and tinted black comes out ~10% too heavy.
// Each glyph is drawn once per bucket into one RGBA channel each.
const COVERAGE_FILLS = ['#000000', '#606060', '#a0a0a0', '#ffffff']

function rasterizeCoverage(
  ctx: CanvasRenderingContext2D,
  pxW: number,
  pxH: number,
  draw: () => void,
): Uint8Array {
  const masks = COVERAGE_FILLS.map((fill) => {
    ctx.fillStyle = fill
    draw()
    const mask = ctx.getImageData(0, 0, pxW, pxH)
    clearCanvas(ctx, pxW, pxH)
    return mask
  })
  return packCoverage(masks)
}

// Which bucket a color falls in is the rasterizer's own luminance formula, so
// it is measured: a probe drawn in the color matches one bucket's probe.
function createCoverageChannelLookup(
  ctx: CanvasRenderingContext2D,
  geometry: AtlasGeometry,
): (color: RGBA) => number {
  const probe = (fill: string): Uint8ClampedArray => {
    ctx.fillStyle = fill
    ctx.fillText('Mg', 0, geometry.baselinePxY / geometry.pixelsPerUnit)
    const mask = ctx.getImageData(0, 0, geometry.slotPxW, geometry.cellPxH)
    clearCanvas(ctx, geometry.slotPxW, geometry.cellPxH)
    return mask.data
  }
  const references = COVERAGE_FILLS.map(probe)
  const channels = new Map<string, number>()
  return (color: RGBA): number => {
    const fill = `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`
    const cached = channels.get(fill)
    if (cached !== undefined) return cached
    const mask = probe(fill)
    let channel = 0
    let distanceMin = Number.POSITIVE_INFINITY
    for (let c = 0; c < references.length; c++) {
      const distance = alphaDistance(mask, references[c] as Uint8ClampedArray)
      if (distance < distanceMin) {
        distanceMin = distance
        channel = c
      }
    }
    channels.set(fill, channel)
    return channel
  }
}

function alphaDistance(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  assert(a.length === b.length, 'Probes must have the same size')
  let distance = 0
  for (let i = 3; i < a.length; i += 4) {
    distance += Math.abs((a[i] as number) - (b[i] as number))
  }
  return distance
}

function clearCanvas(ctx: CanvasRenderingContext2D, pxW: number, pxH: number) {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, pxW, pxH)
  ctx.restore()
}

// Whole pixels as little-endian words, so alpha is the top byte.
function packCoverage(masks: readonly ImageData[]): Uint8Array {
  assert(masks.length === 4, 'Coverage packs one mask per RGBA channel')
  assert(new Uint8Array(new Uint32Array([1]).buffer)[0] === 1, 'Little-endian')
  const pixelCount = (masks[0] as ImageData).data.length / 4
  const [mask0, mask1, mask2, mask3] = masks.map((mask) => {
    assert(mask.data.length === pixelCount * 4, 'Coverage masks must match')
    return new Uint32Array(mask.data.buffer, mask.data.byteOffset, pixelCount)
  }) as [Uint32Array, Uint32Array, Uint32Array, Uint32Array]
  const coverage = new Uint32Array(pixelCount)
  for (let i = 0; i < pixelCount; i++) {
    coverage[i] =
      ((mask0[i] as number) >>> 24) |
      (((mask1[i] as number) >>> 24) << 8) |
      (((mask2[i] as number) >>> 24) << 16) |
      (((mask3[i] as number) >>> 24) << 24)
  }
  return new Uint8Array(coverage.buffer)
}

function rasterizeSlot(
  ctx: CanvasRenderingContext2D,
  ch: string,
  slotPxX: number,
  slotPxY: number,
  geometry: AtlasGeometry,
): void {
  const { pixelsPerUnit, cellPxW, cellPxH } = geometry
  for (let step = 0; step < GLYPH_SUBPIXEL_STEPS; step++) {
    const cellPxX = slotPxX + step * cellPxW
    const penPxX = cellPxX + ATLAS_CELL_PADDING_PX + step / GLYPH_SUBPIXEL_STEPS
    ctx.save()
    ctx.beginPath()
    ctx.rect(
      cellPxX / pixelsPerUnit,
      slotPxY / pixelsPerUnit,
      cellPxW / pixelsPerUnit,
      cellPxH / pixelsPerUnit,
    )
    ctx.clip()
    ctx.fillText(
      ch,
      penPxX / pixelsPerUnit,
      (slotPxY + geometry.baselinePxY) / pixelsPerUnit,
    )
    ctx.restore()
  }
}

function slotGlyph(
  slotPxX: number,
  slotPxY: number,
  advance: number,
  geometry: AtlasGeometry,
): AtlasGlyph {
  const { cellPxW, cellPxH, atlasPxW, atlasPxH } = geometry
  return {
    u0: slotPxX / atlasPxW,
    v0: slotPxY / atlasPxH,
    u1: (slotPxX + cellPxW) / atlasPxW,
    v1: (slotPxY + cellPxH) / atlasPxH,
    advance,
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

// The font is set at its CSS size under a device-pixel transform, not at the
// device size, because SF picks its optical size from the font size: at 28px
// it switches to the tighter Display cut, unlike the DOM at 14px.
function newFontCanvas(
  font: FontSpec,
  pixelsPerUnit: number,
  w: number,
  h: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('failed to get 2d context')
  ctx.setTransform(pixelsPerUnit, 0, 0, pixelsPerUnit, 0, 0)
  ctx.font = fontString(font, font.size)
  ctx.textBaseline = 'alphabetic'
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
  { id: 'ArrowHeadLeft' as const, Component: IconArrowHeadLeft },
  { id: 'ArrowHeadRight' as const, Component: IconArrowHeadRight },
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
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
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

  const image = ctx.getImageData(0, 0, atlasPxW, atlasPxH)
  const coverage = packCoverage([image, image, image, image])
  const texture = createCoverageTexture(gl, atlasPxW, atlasPxH, coverage)
  const sampling: TextSampling = {
    texture,
    subpixelSteps: 1,
    subpixelStepU: 0,
    cellPen: [0, 0],
  }
  return { sampling, cells }
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

// The coverage fills the top rows; WebGL zeroes the rest.
function createCoverageTexture(
  gl: WebGL2RenderingContext,
  pxW: number,
  pxH: number,
  coverage: Uint8Array,
): WebGLTexture {
  const coveragePxH = coverage.length / 4 / pxW
  assert(Number.isInteger(coveragePxH), 'Coverage must be whole RGBA rows')
  assert(coveragePxH <= pxH, 'Coverage must fit the texture')
  const texture = gl.createTexture()
  if (!texture) throw new Error('createTexture failed')
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, pxW, pxH)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    0,
    0,
    pxW,
    coveragePxH,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    coverage,
  )
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
    background: WebGLUniformLocation
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
    subpixelSteps: WebGLUniformLocation
    subpixelStepU: WebGLUniformLocation
    cellPen: WebGLUniformLocation
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
    dpr: WebGLUniformLocation
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

// pos.xy, size.xy, color.rgba, radii.xyzw, border, z
const ROUND_ATTRIBUTES: InstanceAttributes = {
  strideF: QUAD_STRIDE_F,
  sizes: [2, 2, 4, 4, 1, 1],
}
// pos.xy, size.xy, uv.xyzw, color.rgba, z, channel
const TEXT_ATTRIBUTES: InstanceAttributes = {
  strideF: TEXT_STRIDE_F,
  sizes: [2, 2, 4, 4, 1, 1],
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
  arrowHead: InstancedPassBuffer
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
  arrowHead: PassLayout
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
  private textZoom: number

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
    arrowHead: EMPTY_LAYOUT,
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
    scale: number,
  ): Promise<WebGLRenderer> {
    const iconAtlas = await buildIconAtlas(gl, dpr)
    return new WebGLRenderer(gl, dpr, scale, iconAtlas)
  }

  private constructor(
    gl: WebGL2RenderingContext,
    dpr: number,
    scale: number,
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
        background: requireUniform(gl, this.programs.fade, 'u_background'),
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
        subpixelSteps: requireUniform(
          gl,
          this.programs.text,
          'u_subpixelSteps',
        ),
        subpixelStepU: requireUniform(
          gl,
          this.programs.text,
          'u_subpixelStepU',
        ),
        cellPen: requireUniform(gl, this.programs.text, 'u_cellPen'),
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
        dpr: requireUniform(gl, this.programs.connection, 'u_dpr'),
      },
    }
    this.textZoom = textZoomFor(scale)
    const pixelsPerUnit = dpr * this.textZoom
    this.headerAtlas = buildFontAtlas(gl, HEADER_FONT, pixelsPerUnit)
    this.fieldAtlas = buildFontAtlas(gl, FIELD_FONT, pixelsPerUnit)
    this.footerAtlas = buildFontAtlas(gl, FOOTER_FONT, pixelsPerUnit)
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
    const arrowHead = this.createTextPassBuffer(cornerQuad)
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
      arrowHead,
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

  // Glyphs rasterized for the zoom they are shown at match DOM text; scaled
  // from another zoom they blur or alias. Called once zooming settles, as a
  // rebuild per frame of a zoom gesture would stall it.
  rasterizeTextFor(scale: number) {
    if (!drawsNodeDetail(scale)) return
    const textZoom = textZoomFor(scale)
    if (textZoom === this.textZoom) return
    const gl = this.gl
    gl.deleteTexture(this.headerAtlas.sampling.texture)
    gl.deleteTexture(this.fieldAtlas.sampling.texture)
    gl.deleteTexture(this.footerAtlas.sampling.texture)
    const pixelsPerUnit = this.dpr * textZoom
    this.headerAtlas = buildFontAtlas(gl, HEADER_FONT, pixelsPerUnit)
    this.fieldAtlas = buildFontAtlas(gl, FIELD_FONT, pixelsPerUnit)
    this.footerAtlas = buildFontAtlas(gl, FOOTER_FONT, pixelsPerUnit)
    this.textZoom = textZoom
    this.cachedData = null
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
    this.drawGridPass(transform, res, data.palette.gridDot)
    this.drawConnectionPass(transform, res)
    gl.enable(gl.DEPTH_TEST)
    this.drawNodeRange(CONTAINER_RANGE, transform, res)
    this.drawFadedRange(
      GRAYED_RANGE,
      data.palette.grayedAlpha,
      data.palette.canvas,
      transform,
      res,
    )
    this.drawFadedRange(
      DIMMED_RANGE,
      data.palette.dimmedAlpha,
      data.palette.canvas,
      transform,
      res,
    )
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
    const spans = liveConnections(data)
    this.counts.round = this.buildRound(
      renderNodes,
      data.containers,
      data.selectedContainers,
      data.palette,
    )
    this.counts.icon = this.buildIcons(
      renderNodes,
      data.containers,
      data.selectedContainers,
      data.palette,
    )
    this.counts.arrowHead = this.buildArrowHeads(
      renderNodes,
      arrowHeadsByTarget(spans, data),
    )
    this.counts.headerText = this.buildHeaderText(
      renderNodes,
      data.containers,
      data.selectedContainers,
      data.palette,
    )
    this.counts.fieldText = this.buildFieldText(renderNodes, data.palette)
    this.counts.footerText = this.buildFooterText(renderNodes, data.palette)
    this.counts.connections = this.buildConnections(data, spans)
    this.counts.overlap = this.buildOverlap(renderNodes)
  }

  private buildRound(
    renderNodes: readonly RenderNode[],
    containers: readonly GroupContainer[],
    selectedContainers: ReadonlySet<string>,
    palette: GraphPalette,
  ): PassLayout {
    // Upper bound: 5 quads (body, header, border, selection, group outline)
    // per node, plus one pill per visible field, plus two quads (outline,
    // header bar) per open-group container.
    let maxInstances = renderNodes.length * 5 + containers.length * 2
    for (const rn of renderNodes) maxInstances += rn.visibleFields.length
    if (maxInstances === 0) return EMPTY_LAYOUT
    const buf = this.ensureRound(maxInstances)
    const layout = new PassLayoutBuilder()

    const r = CONTAINER_CORNER_RADIUS
    const w = CONTAINER_OUTLINE_WIDTH
    let n = 0
    for (const { box: b, headerBox: h, id } of containers) {
      const line = selectedContainers.has(id) ? palette.accent : palette.text
      const bar = selectedContainers.has(id)
        ? palette.accentFill
        : palette.containerBar
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
          palette.accent,
          corner + inset,
          corner + inset,
          corner + inset,
          corner + inset,
          SELECTION_OUTLINE_WIDTH,
          z,
        )
      }

      writeRound(
        buf,
        n++,
        x,
        y,
        width,
        height,
        palette.nodeBody,
        corner,
        corner,
        corner,
        corner,
        0,
        z,
      )

      const { color: headerCssColor } = getColor(node)
      const headerRgb = cssRgbToRgba(headerCssColor)
      const headerColor = flags.isGrayedOut ? desaturate(headerRgb) : headerRgb
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
      )

      writeRound(
        buf,
        n++,
        x,
        y,
        width,
        height,
        palette.nodeBorder,
        corner,
        corner,
        corner,
        corner,
        NODE_BORDER_WIDTH,
        z,
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
          palette.text,
          corner + inset,
          corner + inset,
          corner + inset,
          corner + inset,
          GROUP_OUTLINE_WIDTH,
          z,
        )
      }

      for (let row = 0; row < rn.rows.length; row++) {
        if (isRowHighlighted(rn, row)) {
          const rowY = y + HEADER_HEIGHT + row * FIELD_HEIGHT
          writeRound(
            buf,
            n++,
            x + HIGHLIGHTED_ROW_INSET,
            rowY,
            width - HIGHLIGHTED_ROW_INSET * 2,
            FIELD_HEIGHT,
            palette.highlightedRowFill,
            HIGHLIGHTED_ROW_RADIUS,
            HIGHLIGHTED_ROW_RADIUS,
            HIGHLIGHTED_ROW_RADIUS,
            HIGHLIGHTED_ROW_RADIUS,
            0,
            z,
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
    palette: GraphPalette,
  ): PassLayout {
    let max = renderNodes.length * 3 + containers.length
    for (const rn of renderNodes) max += rn.visibleFields.length
    if (max === 0) return EMPTY_LAYOUT
    const buf = this.ensureText(max)
    const layout = new PassLayoutBuilder()

    let n = 0
    for (const { headerBox: h, id } of containers) {
      const iconY = h.y + (h.height - HEADER_ICON_SIZE) / 2
      const color = selectedContainers.has(id) ? TEXT_ON_ACCENT : palette.text
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
      const headerTextColor = isDark
        ? HEADER_TEXT_ON_DARK
        : HEADER_TEXT_ON_LIGHT
      const addrColor =
        node.addressType === 'Unverified' ? HEADER_UNVERIFIED : headerTextColor
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

      let rightX = x + width - HEADER_PADDING - HEADER_ICON_SIZE
      if (node.hasTemplate) {
        n += this.emitIcon(
          buf,
          n,
          'InitialCircle',
          rightX,
          iconY,
          HEADER_ICON_SIZE,
          HEADER_TEMPLATE,
          z,
        )
        rightX -= HEADER_BADGE_STEP
      }
      if (node.isInitial) {
        n += this.emitIcon(
          buf,
          n,
          'InitialCircle',
          rightX,
          iconY,
          HEADER_ICON_SIZE,
          HEADER_INITIAL,
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
            ? desaturate(palette.dot)
            : useAutumn
              ? palette.accent
              : palette.dot
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

  private buildArrowHeads(
    renderNodes: readonly RenderNode[],
    arrowHeads: ReadonlyMap<string, ArrowHeads>,
  ): PassLayout {
    if (arrowHeads.size === 0) return EMPTY_LAYOUT
    const buf = this.ensureText(renderNodes.length * 2)
    const layout = new PassLayoutBuilder()
    let n = 0
    for (const { node, z, range } of renderNodes) {
      layout.enter(range, n)
      const arrows = arrowHeads.get(node.id)
      if (arrows === undefined) continue
      const { x, y, width } = node.box
      const cellY = y + HEADER_HEIGHT / 2 - ARROW_HEAD_CELL / 2
      if (arrows.left) {
        n += this.emitIcon(
          buf,
          n,
          'ArrowHeadRight',
          x - ARROW_HEAD_CELL * ARROW_HEAD_TIP,
          cellY,
          ARROW_HEAD_CELL,
          arrows.left,
          z,
        )
      }
      if (arrows.right) {
        n += this.emitIcon(
          buf,
          n,
          'ArrowHeadLeft',
          x + width - ARROW_HEAD_CELL * (1 - ARROW_HEAD_TIP),
          cellY,
          ARROW_HEAD_CELL,
          arrows.right,
          z,
        )
      }
    }
    this.upload(this.buffers.arrowHead.data, buf, n, TEXT_STRIDE_F)
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
      0,
    )
    return 1
  }

  private buildHeaderText(
    renderNodes: readonly RenderNode[],
    containers: readonly GroupContainer[],
    selectedContainers: ReadonlySet<string>,
    palette: GraphPalette,
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
        selectedContainers.has(id) ? TEXT_ON_ACCENT : palette.text,
        h.x + h.width - HEADER_PADDING,
        CONTAINER_Z,
      )
    }
    for (const { node, flags, z, range, headerH } of renderNodes) {
      layout.enter(range, n)
      const { isDark } = getColor(node)
      const baseColor = isDark ? HEADER_TEXT_ON_DARK : HEADER_TEXT_ON_LIGHT
      const color = flags.isGrayedOut ? desaturate(baseColor) : baseColor
      const startX =
        node.box.x + HEADER_PADDING + HEADER_ICON_SIZE + HEADER_ITEM_GAP
      const badges = Number(node.hasTemplate) + Number(node.isInitial)
      const badgesWidth =
        badges === 0 ? 0 : HEADER_ICON_SIZE + (badges - 1) * HEADER_BADGE_STEP
      const maxX =
        node.box.x +
        node.box.width -
        HEADER_PADDING -
        badgesWidth -
        HEADER_ITEM_GAP
      const baselineY = node.box.y + headerH / 2 + atlas.refSize / 2 - 2
      n += writeStringInstances(
        buf,
        n,
        node.name,
        startX,
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

  private buildFieldText(
    renderNodes: readonly RenderNode[],
    palette: GraphPalette,
  ): PassLayout {
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
        const baseColor = isRowHighlighted(rn, row)
          ? palette.highlightedRowText
          : palette.text
        const color = flags.isGrayedOut ? desaturate(baseColor) : baseColor
        const startX = node.box.x + HEADER_PADDING
        const maxX = node.box.x + node.box.width - HEADER_PADDING
        n += writeStringInstances(
          buf,
          n,
          ellipsizeStart((rn.rows[row] as NodeRow).label, atlas, maxX - startX),
          startX,
          baselineY,
          atlas,
          color,
          maxX,
          z,
        )
      }
    }
    this.upload(this.buffers.fieldText.data, buf, n, TEXT_STRIDE_F)
    return layout.finish(n)
  }

  private buildFooterText(
    renderNodes: readonly RenderNode[],
    palette: GraphPalette,
  ): PassLayout {
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
      const baseColor = palette.footerText
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
  private buildConnections(
    data: DrawData,
    spans: readonly ConnectionSpan[],
  ): number {
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
        data.palette.accent,
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
    gridDot: RGBA,
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
    gl.uniform4fv(this.uniforms.grid.color, gridDot)
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
      this.buffers.arrowHead,
      this.iconAtlas.sampling,
      this.counts.arrowHead,
      range,
      transform,
      res,
    )
    if (!drawsNodeDetail(transform.scale)) return
    this.drawTextPass(
      this.buffers.icon,
      this.iconAtlas.sampling,
      this.counts.icon,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.headerText,
      this.headerAtlas.sampling,
      this.counts.headerText,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.fieldText,
      this.fieldAtlas.sampling,
      this.counts.fieldText,
      range,
      transform,
      res,
    )
    this.drawTextPass(
      this.buffers.footerText,
      this.footerAtlas.sampling,
      this.counts.footerText,
      range,
      transform,
      res,
    )
  }

  private drawFadedRange(
    range: NodeRange,
    alpha: number,
    background: RGBA,
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
    gl.uniform3f(
      this.uniforms.fade.background,
      background[0],
      background[1],
      background[2],
    )
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
    sampling: TextSampling,
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
    gl.bindTexture(gl.TEXTURE_2D, sampling.texture)
    gl.uniform1i(this.uniforms.text.atlas, 0)
    gl.uniform1f(this.uniforms.text.subpixelSteps, sampling.subpixelSteps)
    gl.uniform1f(this.uniforms.text.subpixelStepU, sampling.subpixelStepU)
    gl.uniform2f(
      this.uniforms.text.cellPen,
      sampling.cellPen[0],
      sampling.cellPen[1],
    )
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
    gl.uniform1f(this.uniforms.connection.dpr, this.dpr)
    gl.bindVertexArray(this.buffers.connections.vao)
    gl.drawArraysInstanced(
      gl.TRIANGLE_STRIP,
      0,
      (CONNECTION_SEGMENTS_MAX + 1) * 2,
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
      this.buffers.arrowHead,
      this.buffers.connections,
      this.buffers.overlap,
    ]) {
      gl.deleteBuffer(pass.data)
      gl.deleteVertexArray(pass.vao)
    }
    gl.deleteTexture(this.headerAtlas.sampling.texture)
    gl.deleteTexture(this.fieldAtlas.sampling.texture)
    gl.deleteTexture(this.footerAtlas.sampling.texture)
    gl.deleteTexture(this.iconAtlas.sampling.texture)
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
    return data.palette.connectionGrayed
  }
  if (data.enableDimming && data.anyNodeSelected) {
    return data.palette.connectionDimmed
  }
  return data.palette.connection
}

interface ArrowHeads {
  left?: RGBA
  right?: RGBA
}

// Every edge into a node meets at one point on its header, so one arrow per
// side marks them all; it takes the accent when any of them is highlighted.
function arrowHeadsByTarget(
  spans: readonly ConnectionSpan[],
  data: DrawData,
): Map<string, ArrowHeads> {
  const result = new Map<string, ArrowHeads>()
  for (const span of spans) {
    const side = span.field.connection.to.direction
    const heads = result.get(span.target.id) ?? {}
    if (heads[side] === data.palette.accent) continue
    heads[side] = isConnectionHighlighted(span, data)
      ? data.palette.accent
      : arrowHeadColor(span, data)
    result.set(span.target.id, heads)
  }
  return result
}

function arrowHeadColor(span: ConnectionSpan, data: DrawData): RGBA {
  const color = connectionColor(span, data)
  if (color === data.palette.connection) return data.palette.dot
  return color
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
  out[b + 2] =
    to.x + (to.direction === 'left' ? -ARROW_HEAD_LENGTH : ARROW_HEAD_LENGTH)
  out[b + 3] = to.y
  const offset = controlOffset(Math.abs(to.x - from.x))
  out[b + 4] = from.x + (from.direction === 'left' ? -offset : offset)
  out[b + 5] = to.x + (to.direction === 'left' ? -offset : offset)
  out[b + 6] = color[0]
  out[b + 7] = color[1]
  out[b + 8] = color[2]
  out[b + 9] = color[3]
  out[b + 10] = width
  out[b + 11] = span.isDashed ? 1 : 0
  return i + 1
}

function controlOffset(gap: number): number {
  return Math.min(
    CONNECTION_CONTROL_OFFSET_MAX,
    Math.max(CONNECTION_CONTROL_OFFSET_MIN, gap * CONNECTION_CONTROL_GAP_SHARE),
  )
}

// (sample, side) pairs along the curve, two per sample, for a triangle strip.
// The shader turns a sample into t once it knows the curve's segment count.
function createConnectionStrip(gl: WebGL2RenderingContext): WebGLBuffer {
  const vertices = new Float32Array((CONNECTION_SEGMENTS_MAX + 1) * 4)
  for (let sample = 0; sample <= CONNECTION_SEGMENTS_MAX; sample++) {
    vertices[sample * 4] = sample
    vertices[sample * 4 + 1] = 1
    vertices[sample * 4 + 2] = sample
    vertices[sample * 4 + 3] = -1
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
  channel: number,
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
  out[base + 13] = channel
}

// Field paths share their start (`accessControl.`) and differ at the end
// (`EXECUTOR_ROLE.members[1]`), so a long one keeps its tail. A cut inside a
// word moves to where the next word starts when that drops only a few
// characters; a cut at a word start stays, so `L1_` is not lost.
const WORD_SNAP_MAX = 6
function ellipsizeStart(text: string, atlas: FontAtlas, width: number): string {
  if (measureString(text, atlas) <= width) return text
  const chars = Array.from(text)
  const budget = width - atlas.getGlyph('…').advance
  let used = 0
  let tail = chars.length
  while (tail > 0) {
    const ch = chars[tail - 1] as string
    const next = chars[tail]
    const kerning = next === undefined ? 0 : atlas.kerning(ch, next)
    const advance = atlas.getGlyph(ch).advance + kerning
    if (used + advance > budget) break
    used += advance
    tail--
  }
  assert(tail > 0, 'Start ellipsis must drop a character')
  if (!isWordCharacter(chars[tail - 1] as string)) {
    return `…${chars.slice(tail).join('')}`
  }
  for (let i = tail; i < chars.length - 1 && i < tail + WORD_SNAP_MAX; i++) {
    if (chars[i] === '.' || chars[i] === '_') {
      tail = i + 1
      break
    }
    if (startsCamelCaseWord(chars, i)) {
      tail = i
      break
    }
  }
  return `…${chars.slice(tail).join('')}`
}

function isWordCharacter(char: string): boolean {
  return char !== '.' && char !== '_'
}

function startsCamelCaseWord(chars: readonly string[], i: number): boolean {
  const current = chars[i] as string
  const previous = chars[i - 1]
  if (previous === undefined) return false
  if (current === current.toLowerCase()) return false
  return previous !== previous.toUpperCase()
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
  const fits = cursorX + measureString(text, atlas) <= maxX
  const penLimit = (fits ? maxX : maxX - ellipsis.advance) - cursorX
  const paint: GlyphPaint = { color, channel: atlas.coverageChannel(color), z }

  let penX = 0
  let written = 0
  let previous: string | undefined
  for (const ch of text) {
    const glyph = atlas.getGlyph(ch)
    const glyphX =
      previous === undefined ? penX : penX + atlas.kerning(previous, ch)
    if (glyphX + glyph.advance > penLimit) break
    const at = startInstance + written
    writeGlyphInstance(
      out,
      at,
      atlas,
      glyph,
      cursorX + glyphX,
      baselineY,
      paint,
    )
    written++
    penX = glyphX + glyph.advance
    previous = ch
  }

  if (!fits && cursorX + penX + ellipsis.advance <= maxX) {
    const at = startInstance + written
    writeGlyphInstance(
      out,
      at,
      atlas,
      ellipsis,
      cursorX + penX,
      baselineY,
      paint,
    )
    written++
  }
  return written
}

interface GlyphPaint {
  color: RGBA
  channel: number
  z: number
}

function writeGlyphInstance(
  out: Float32Array,
  instance: number,
  atlas: FontAtlas,
  glyph: AtlasGlyph,
  penX: number,
  baselineY: number,
  paint: GlyphPaint,
): void {
  writeTextQuad(
    out,
    instance,
    penX,
    baselineY,
    atlas.cellW,
    atlas.cellH,
    glyph.u0,
    glyph.v0,
    glyph.u1,
    glyph.v1,
    paint.color,
    paint.z,
    paint.channel,
  )
}

function measureString(text: string, atlas: FontAtlas): number {
  let width = 0
  let previous: string | undefined
  for (const ch of text) {
    if (previous !== undefined) width += atlas.kerning(previous, ch)
    width += atlas.getGlyph(ch).advance
    previous = ch
  }
  return width
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
  palette: GraphPalette,
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
    palette,
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

  const theme = useTheme()

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
        theme === 'light' ? LIGHT_GRAPH_PALETTE : DARK_GRAPH_PALETTE,
      ),
    [
      graph,
      selected,
      enableDimming,
      highlightOverlapping,
      markUnreachableEntries,
      theme,
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

  const [failure, setFailure] = useState<string | null>(null)
  // Bumped to build a new renderer: when the browser restores a lost context,
  // and when the pixel ratio changes, as the atlases are drawn for one ratio.
  const [rendererGeneration, setRendererGeneration] = useState(0)

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
      setFailure(
        'The node view needs WebGL2, which this browser did not provide.',
      )
      return
    }
    const dpr = window.devicePixelRatio || 1
    WebGLRenderer.create(gl, dpr, useStore.getState().transform.scale)
      .then((renderer) => {
        if (cancelled) {
          renderer.dispose()
          return
        }
        rendererRef.current = renderer
        // A zoom that settled while the icons loaded found no renderer.
        renderer.rasterizeTextFor(useStore.getState().transform.scale)
        setFailure(null)
        scheduleDraw.current()
      })
      .catch((error) => {
        if (cancelled) return
        console.error('WebGL renderer init failed', error)
        setFailure(
          'The node view could not start WebGL. Reload the page to try again.',
        )
      })
    return () => {
      cancelled = true
      rendererRef.current?.dispose()
      rendererRef.current = null
    }
  }, [rendererGeneration])

  // A GPU reset or too many contexts can take the context away. Keeping the
  // default would leave the canvas blank for good; preventing it lets the
  // browser restore the context, and a new renderer rebuilds everything.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onLost = (event: Event) => {
      event.preventDefault()
      rendererRef.current = null
      setFailure('The node view lost its WebGL context and is waiting for it.')
    }
    const onRestored = () =>
      setRendererGeneration((generation) => generation + 1)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [])

  // Moving the window to a display with another scale changes the ratio. The
  // query matches only the ratio the current renderer was built for.
  useEffect(() => {
    const query = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    )
    const onChange = () => setRendererGeneration((generation) => generation + 1)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [rendererGeneration])

  // Redraw when derived data changes.
  useEffect(() => {
    scheduleDraw.current()
  }, [data])

  // Redraw on any store change (covers pan/zoom without going through React).
  // Text is rasterized again for a new zoom once it has not changed for a
  // while, see rasterizeTextFor.
  useEffect(() => {
    let scale = useStore.getState().transform.scale
    let settleTimer: ReturnType<typeof setTimeout> | null = null
    const rasterizeText = () => {
      settleTimer = null
      rendererRef.current?.rasterizeTextFor(useStore.getState().transform.scale)
      scheduleDraw.current()
    }
    const unsub = useStore.subscribe((state) => {
      if (state.transform.scale !== scale) {
        scale = state.transform.scale
        if (settleTimer !== null) clearTimeout(settleTimer)
        settleTimer = setTimeout(rasterizeText, TEXT_RASTER_SETTLE_MS)
      }
      scheduleDraw.current()
    })
    return () => {
      unsub()
      if (settleTimer !== null) clearTimeout(settleTimer)
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
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {failure !== null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center text-coffee-200 text-sm">
          {failure}
        </div>
      )}
    </>
  )
}
