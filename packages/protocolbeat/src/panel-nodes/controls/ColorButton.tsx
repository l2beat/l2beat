import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { SELECTABLE_COLORS } from '../view/colors/colors'
import { oklchColorToCSS } from '../view/colors/oklch'
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

  function changeColor(color: number) {
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

interface ColorPickerProps {
  onColorChange: (color: number) => void
}

function ColorPicker({ onColorChange }: ColorPickerProps) {
  return (
    <div className="grid w-max grid-cols-6 place-items-center gap-3">
      <button
        style={{
          background:
            'conic-gradient(#9ED110, #50B517, #179067, #476EAF, #9f49ac, #CC42A2, #FF3BA7, #FF5800, #FF8100, #FEAC00, #FFCC00, #EDE604, #9ED110)',
        }}
        className="h-12 w-12 rounded border border-coffee-600 shadow-xl hover:ring"
        onClick={() => onColorChange(0)}
      />
      {SELECTABLE_COLORS.map((c, i) => (
        <button
          style={{ backgroundColor: oklchColorToCSS(c.color) }}
          className="h-12 w-12 rounded border border-coffee-600 shadow-xl hover:ring"
          key={i}
          onClick={() => onColorChange(i + 1)}
        />
      ))}
    </div>
  )
}
