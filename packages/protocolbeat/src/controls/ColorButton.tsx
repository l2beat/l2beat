import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { OklchColor, oklchColorToCSS } from '../utils/color'
import { ControlButton } from './ControlButton'

export function ColorButton() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectionExists = useStore((state) => state.selectedNodeIds.length > 0)
  const colorSelected = useStore((state) => state.colorSelected)

  useEffect(() => {
    if (!open) {
      return
    }
    function onClick(e: MouseEvent) {
      const box = ref.current?.getBoundingClientRect()
      if (
        !box ||
        e.clientX < box.left ||
        e.clientX > box.right ||
        e.clientY < box.top ||
        e.clientY > box.bottom
      ) {
        setOpen(false)
      }
    }

    // We use setTimeout to ignore the click on the button to open
    const timeout = setTimeout(
      () => window.addEventListener('click', onClick),
      0,
    )
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('click', onClick)
    }
  }, [ref, open, setOpen])

  return (
    <>
      <ControlButton disabled={!selectionExists} onClick={() => setOpen(true)}>
        Color
      </ControlButton>
      {open && (
        <div ref={ref} className="absolute bottom-20">
          <ColorPicker onColorChange={colorSelected} />
        </div>
      )}
    </>
  )
}

export interface ColorPickerProps {
  onColorChange: (color: OklchColor) => void
}

export function ColorPicker({ onColorChange }: ColorPickerProps) {
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
          onClick={() => onColorChange(c)}
        ></div>
      ))}
    </div>
  )
}
