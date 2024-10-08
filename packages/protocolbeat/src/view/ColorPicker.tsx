import { SimpleNode } from '../api/SimpleNode'
import { Color, colorToCSS } from '../utils/color'
import { oklch2rgb } from '../utils/oklch'

export interface ColorPickerProps {
  ids: SimpleNode['id'][]
  onColorChange: (ids: string[], color: Color) => void
}

export function ColorPicker({ ids, onColorChange }: ColorPickerProps) {
  const colors: Color[] = [
    oklch2rgb(1.0, 0, 90),
    oklch2rgb(0.6, 0.2, 22),
    oklch2rgb(0.6, 0.2, 35),
    oklch2rgb(0.6, 0.2, 142),
    oklch2rgb(0.6, 0.2, 267),
    oklch2rgb(0.6, 0.2, 320),
    oklch2rgb(0.6, 0.2, 350),

    oklch2rgb(0.8, 0, 90),
    oklch2rgb(0.7, 0.18, 22),
    oklch2rgb(0.7, 0.18, 35),
    oklch2rgb(0.7, 0.18, 142),
    oklch2rgb(0.7, 0.18, 267),
    oklch2rgb(0.7, 0.18, 320),
    oklch2rgb(0.7, 0.18, 350),

    oklch2rgb(0.6, 0, 90),
    oklch2rgb(0.8, 0.14, 22),
    oklch2rgb(0.8, 0.14, 35),
    oklch2rgb(0.8, 0.14, 142),
    oklch2rgb(0.8, 0.14, 267),
    oklch2rgb(0.8, 0.14, 320),
    oklch2rgb(0.8, 0.14, 350),
  ]

  return (
    <div className="grid grid-cols-7 place-items-center gap-3">
      {colors.map((c, i) => (
        <div
          style={{ backgroundColor: colorToCSS(c) }}
          className="h-12 w-12 rounded border shadow-xl hover:ring active:opacity-50"
          key={i}
          onClick={() => onColorChange(ids, c)}
        ></div>
      ))}
    </div>
  )
}
