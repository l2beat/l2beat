import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { OklchColor, oklchColorToCSS } from '../store/utils/color'
import { ControlButton } from './ControlButton'

export function ColorButton() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectionExists = useStore((state) => state.selected.length > 0)
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

  function changeColor(color: OklchColor) {
    colorSelected(color)
    setOpen(false)
  }

  return (
    <>
      <ControlButton disabled={!selectionExists} onClick={() => setOpen(true)}>
        Color
      </ControlButton>
      {open && (
        <div
          ref={ref}
          className="-translate-x-1/2 absolute bottom-14 left-1/2 w-max"
        >
          <ColorPicker onColorChange={changeColor} />
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
    { l: 0.3, c: 0.02, h: 39.29 },
    { l: 0.34, c: 0.06, h: 270 },
    { l: 0.31, c: 0.15, h: 266 },
    { l: 0.35, c: 0.06, h: 160 },
    { l: 0.29, c: 0.06, h: 129 },
    { l: 0.45, c: 0.08, h: 208 },
    { l: 0.33, c: 0.2, h: 318 },
    { l: 0, c: 0, h: 90 },
  ]

  return (
    <div className="grid w-max grid-cols-7 place-items-center gap-3">
      {colors.map((c, i) => (
        <div
          style={{ backgroundColor: oklchColorToCSS(c) }}
          className="h-12 w-12 rounded border border-latte shadow-xl hover:ring"
          key={i}
          onClick={() => onColorChange(c)}
        ></div>
      ))}
    </div>
  )
}
