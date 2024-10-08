import { SimpleNode } from '../api/SimpleNode'
import { OklchColor, oklchColorToCSS } from '../utils/color'

export interface ColorPickerProps {
  ids: SimpleNode['id'][]
  onColorChange: (ids: string[], color: OklchColor) => void
}

export function ColorPicker({ ids, onColorChange }: ColorPickerProps) {
  const colors: OklchColor[] = [
    { l: 1.0, c: 0, h: 90 },
    { l: 0.6, c: 0.2, h: 22 },
    { l: 0.6, c: 0.2, h: 35 },
    { l: 0.6, c: 0.2, h: 142 },
    { l: 0.6, c: 0.2, h: 267 },
    { l: 0.6, c: 0.2, h: 320 },
    { l: 0.6, c: 0.2, h: 350 },

    { l: 0.8, c: 0, h: 90 },
    { l: 0.7, c: 0.18, h: 22 },
    { l: 0.7, c: 0.18, h: 35 },
    { l: 0.7, c: 0.18, h: 142 },
    { l: 0.7, c: 0.18, h: 267 },
    { l: 0.7, c: 0.18, h: 320 },
    { l: 0.7, c: 0.18, h: 350 },

    { l: 0.6, c: 0, h: 90 },
    { l: 0.8, c: 0.14, h: 22 },
    { l: 0.8, c: 0.14, h: 35 },
    { l: 0.8, c: 0.14, h: 142 },
    { l: 0.8, c: 0.14, h: 267 },
    { l: 0.8, c: 0.14, h: 320 },
    { l: 0.8, c: 0.14, h: 350 },
  ]

  return (
    <div className="grid grid-cols-7 place-items-center gap-3">
      {colors.map((c, i) => (
        <div
          style={{ backgroundColor: oklchColorToCSS(c) }}
          className="h-12 w-12 rounded border shadow-xl hover:ring active:opacity-50"
          key={i}
          onClick={() => onColorChange(ids, c)}
        ></div>
      ))}
    </div>
  )
}
