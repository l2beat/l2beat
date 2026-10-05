/**
 * One full-card pass that draws every piece of goo: a metaball field summed
 * from the balls near the pixel, plus the pool rising under the wave. The
 * iso-line of the field is the goo's edge, anti-aliased by its distance in
 * pixels; the field's slope, read as the height of a sphere, lights it.
 */
export function getFragmentShader(maxBalls: number) {
  return `
precision highp float;

#define MAX_BALLS ${maxBalls}
#define CORNER 6.0

uniform vec4 u_ball[MAX_BALLS];  // x, y in CSS px, 1 / reach², 1 / stretch
uniform vec4 u_tint[MAX_BALLS];  // OKLab lightness, a, b, chroma
uniform vec4 u_look[MAX_BALLS];  // amplitude, opacity, saturation, shape (0: color only)
uniform int u_count;

uniform float u_canvasHeight;
uniform float u_scale;
uniform float u_threshold;
uniform float u_bulge;

uniform sampler2D u_wave;
uniform float u_columns;
uniform float u_width;
uniform float u_poolOn;
uniform float u_poolTop;
uniform float u_poolDepth;
uniform float u_poolReach;
uniform float u_poolLip;
uniform vec4 u_poolVessel;  // left, right, bottom, corner radius
uniform vec4 u_poolCalm;  // left, right, top, bottom of the flat inside, unlit
uniform vec4 u_poolTint;
uniform vec4 u_poolDeep;
uniform vec2 u_poolLook;

uniform vec3 u_light;
uniform vec3 u_halfway;
uniform float u_shade;
uniform float u_rim;
uniform float u_specular;
uniform float u_sheen;
uniform float u_halo;

float columnHeight(float column) {
  float c = clamp(column, 0.0, u_columns - 1.0);
  vec4 texel = texture2D(u_wave, vec2((c + 0.5) / u_columns, 0.5));
  // 16 bits over two bytes, as plain byte textures work everywhere
  return (texel.r * 65280.0 + texel.g * 255.0) / 65535.0 * 128.0 - 64.0;
}

// How far inside the vessel's walls and floor, rounded at its bottom corners
float insideVessel(vec2 p) {
  vec2 center = vec2(0.5 * (u_poolVessel.x + u_poolVessel.y), u_poolVessel.z - 2000.0);
  vec2 size = vec2(0.5 * (u_poolVessel.y - u_poolVessel.x), 2000.0);
  vec2 q = abs(p - center) - size + u_poolVessel.w;
  return u_poolVessel.w - length(max(q, 0.0)) - min(max(q.x, q.y), 0.0);
}

// Catmull-Rom through the columns: smooth slope, so no kinks in the highlight
vec2 surfaceAt(float x) {
  float u = clamp(x / u_width, 0.0, 1.0) * (u_columns - 1.0);
  float i = floor(u);
  float t = u - i;
  float p0 = columnHeight(i - 1.0);
  float p1 = columnHeight(i);
  float p2 = columnHeight(i + 1.0);
  float p3 = columnHeight(i + 2.0);
  float a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
  float b = p0 - 2.5 * p1 + 2.0 * p2 - 0.5 * p3;
  float c = 0.5 * (p2 - p0);
  float height = ((a * t + b) * t + c) * t + p1;
  float slope = ((3.0 * a * t + 2.0 * b) * t + c) * (u_columns - 1.0) / u_width;
  return vec2(height, slope);
}

vec3 oklabToLinearSrgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 linearToSrgb(vec3 c) {
  vec3 low = c * 12.92;
  vec3 high = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(low, high, step(0.0031308, c));
}

// The pool's own color, deeper further down. Shared by the flat inside and
// the full path, so tiles drawn either way meet without a seam
vec4 poolTint(float y) {
  return mix(u_poolTint, u_poolDeep, clamp((y - u_poolTop) / u_poolDepth, 0.0, 1.0));
}

// The hue of the blend, half way back to the chroma of what was blended: no
// mud between two colors, and no glaring third hue either
vec2 vividHue(vec4 tint, float saturation) {
  float chroma = length(tint.yz);
  float restore = chroma > 1e-5 ? mix(1.0, tint.w / chroma, 0.5) : 0.0;
  return tint.yz * restore * saturation;
}

vec3 toSrgb(float lightness, vec2 ab) {
  return linearToSrgb(clamp(oklabToLinearSrgb(vec3(lightness, ab)), 0.0, 1.0));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_canvasHeight - gl_FragCoord.y) / u_scale;

  // most of the pool is flat and unlit: no field, surface or walls to read
  if (u_count == 0 && u_poolOn > 0.5 && p.x > u_poolCalm.x && p.x < u_poolCalm.y
      && p.y > u_poolCalm.z && p.y < u_poolCalm.w) {
    vec4 tint = poolTint(p.y);
    vec3 color = toSrgb(tint.x, vividHue(tint, u_poolLook.y));
    gl_FragColor = vec4(color * u_poolLook.x, u_poolLook.x);
    return;
  }

  float field = 0.0;
  vec2 grad = vec2(0.0);
  vec4 tint = vec4(0.0);
  float saturation = 0.0;
  float weight = 0.0;
  // a ball that only tints says nothing of how opaque the goo is, so a
  // dimmed drop bleeding into the pool cannot thin it out
  float opacity = 0.0;
  float solidWeight = 0.0;

  for (int i = 0; i < MAX_BALLS; i++) {
    if (i >= u_count) break;
    vec4 ball = u_ball[i];
    vec2 d = (p - ball.xy) * vec2(1.0, ball.w);
    float q = dot(d, d) * ball.z;
    if (q < 1.0) {
      vec4 ballLook = u_look[i];
      float k = 1.0 - q;
      float f = ballLook.x * k * k * k;
      field += f * ballLook.w;
      grad -= (6.0 * ballLook.x * ballLook.w * k * k * ball.z) * vec2(d.x, d.y * ball.w);
      // squared, so each ball keeps its own color until close to another
      float w = f * f;
      tint += w * u_tint[i];
      saturation += w * ballLook.z;
      weight += w;
      opacity += w * ballLook.w * ballLook.y;
      solidWeight += w * ballLook.w;
    }
  }

  if (u_poolOn > 0.5) {
    vec2 surface = surfaceAt(p.x);
    float depth = p.y - u_poolTop - surface.x;
    float walls = insideVessel(p);
    // a smooth intersection, so the surface meets the walls in a rounded corner
    float h = clamp(0.5 + 0.5 * (walls - depth) / CORNER, 0.0, 1.0);
    float inside = mix(walls, depth, h) - CORNER * h * (1.0 - h);
    vec2 insideGrad = vec2(-surface.y, 1.0);
    if (h < 1.0) {
      vec2 wallsGrad = vec2(
        insideVessel(p + vec2(0.5, 0.0)) - insideVessel(p - vec2(0.5, 0.0)),
        insideVessel(p + vec2(0.0, 0.5)) - insideVessel(p - vec2(0.0, 0.5))
      );
      insideGrad = mix(wallsGrad, insideGrad, h);
    }
    // outside it reaches out to drops like a ball does; inside, it rises over
    // the lip and levels off, so the lip is lit like a rounded edge
    float f;
    float rise;
    if (inside <= 0.0) {
      float s = max(1.0 + inside / u_poolReach, 0.0);
      f = u_threshold * s * s * s;
      rise = 3.0 * u_threshold * s * s / u_poolReach;
    } else {
      float lift = 1.5 * u_poolLip / u_poolReach;
      float u = 1.0 - min(inside / u_poolLip, 1.0);
      f = u_threshold * (1.0 + lift * (1.0 - u * u));
      rise = 2.0 * u_threshold * lift * u / u_poolLip;
    }
    field += f;
    grad += rise * insideGrad;
    // capped, so a drop's color shows around it as it bleeds in
    float w = min(f, u_threshold);
    w = w * w;
    tint += w * poolTint(p.y);
    saturation += w * u_poolLook.y;
    weight += w;
    opacity += w * u_poolLook.x;
    solidWeight += w;
  }

  float excess = field - u_threshold;
  float gradLength = max(length(grad), 1e-6);
  float coverage = clamp(excess * u_scale / (gradLength * 1.5) + 0.5, 0.0, 1.0);
  float halo = u_halo * smoothstep(u_threshold * 0.15, u_threshold, field);
  if ((coverage <= 0.0 && halo <= 0.0) || weight <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  tint /= weight;
  vec2 ab = vividHue(tint, saturation / weight);
  float opaque = solidWeight > 0.0 ? opacity / solidWeight : 0.0;

  vec2 slope = grad * (u_bulge / (2.0 * sqrt(max(excess, 0.0) + 0.002)));
  vec3 normal = normalize(vec3(-slope, 1.0));
  float edge = pow(1.0 - normal.z, 3.0);
  float lightness = tint.x + u_shade * (dot(normal, u_light) - u_light.z) + u_rim * edge;
  // measured from what a flat face gets, so only curves catch the light
  float flatShine = pow(u_halfway.z, 12.0);
  float nh = max(dot(normal, u_halfway), 0.0);
  float broad = max(pow(nh, 12.0) - flatShine, 0.0) / (1.0 - flatShine);
  float specular = u_specular * (pow(nh, 90.0) + 0.3 * broad) + u_sheen * edge;

  vec3 color = clamp(oklabToLinearSrgb(vec3(lightness, ab)), 0.0, 1.0);
  color = linearToSrgb(clamp(color + specular, 0.0, 1.0));
  float alpha = coverage * opaque;
  // light through the goo tints the card around it, outside its edge only
  float glow = halo * opaque * (1.0 - coverage);
  vec3 glowColor = glow > 0.0 ? toSrgb(tint.x, ab) : vec3(0.0);
  gl_FragColor = vec4(color * alpha + glowColor * glow, alpha + glow);
}
`
}

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`
