import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import graphviz from 'graphviz-wasm'

export async function generateAndOpenGraph(
  clusters: string[][],
): Promise<void> {
  const dot = getSpringGraph(clusters)
  await graphviz.loadWASM()
  const result = graphviz.layout(dot, 'svg', 'neato')
  const outputPath = '/tmp/l2b_graph.html'
  writeFileSync(outputPath, createSvgHtml(result))

  execSync(`open ${outputPath}`)
}

function createSvgHtml(svgString: string): string {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inline SVG</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    ${svgString}
  </body>
  </html>
  `
  return html
}

function getSpringGraph(clusters: string[][]): string {
  let dotFileContent = 'graph G {\n'
  dotFileContent += '  layout=neato;\n'
  dotFileContent += '  start=regular;\n'
  dotFileContent += '  normalize=0;\n'
  dotFileContent += '  sep="+0";\n'
  dotFileContent += '  overlap=false;\n'
  dotFileContent += '  voro_margin=0;\n'
  dotFileContent += '  model="circuit";\n'
  dotFileContent += '  edge [style=invis];\n'
  dotFileContent +=
    '  node [width=.75, height=.75, fontsize=9, fixedsize=true]\n'

  const projectColors: Record<string, string[]> = {}

  clusters.forEach((cluster, i) => {
    const clusterName = `Cluster ${i}`
    const clusterColor = generateHexColorFromString(i * (360 / clusters.length))
    dotFileContent += `  "${clusterName}" [shape=box, style=filled, color="${clusterColor}"];\n`

    for (const entry of cluster) {
      projectColors[entry] ??= []
      projectColors[entry].push(clusterColor)
    }
  })

  for (const entry in projectColors) {
    const colors = projectColors[entry]
    const [chain, projectName] = entry.split(':')
    dotFileContent += `  "${entry}" [label="${chain}\n${projectName}", color="${colors.join(
      ':',
    )}", shape=circle, style=filled];\n`
  }

  clusters.forEach((cluster, i) => {
    const clusterName = `Cluster ${i}`
    for (const entry of cluster) {
      dotFileContent += `  "${clusterName}" -- "${entry}";\n`
    }
  })

  dotFileContent += '}\n'
  return dotFileContent
}

function generateHexColorFromString(hue: number): string {
  const saturation = 90
  const lightness = 65

  const [r, g, b] = hslToRgb(hue, saturation, lightness)
  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sNormalized = s / 100
  const lNormalized = l / 100
  const chroma = (1 - Math.abs(2 * lNormalized - 1)) * sNormalized
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNormalized - chroma / 2

  let r = 0,
    g = 0,
    b = 0
  if (0 <= h && h < 60) {
    r = chroma
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = chroma
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = chroma
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = chroma
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = chroma
  } else if (300 <= h && h < 360) {
    r = chroma
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  return [r, g, b]
}
