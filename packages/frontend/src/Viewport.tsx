import { ReactNode, useEffect, useRef, useState } from 'react'

import { Area } from './viewport/area'

export interface ViewportProps {
  children: ReactNode
}

export function Viewport({ children }: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translate(0px, 0px) scale(1.0)')

  useEffect(() => {
    if (containerRef.current && viewportRef.current) {
      const area = new Area(
        containerRef.current,
        viewportRef.current,
        setTransform,
      )
      return () => area.destroy()
    }
  }, [setTransform])

  return (
    <div
      ref={containerRef}
      className="w-full h-full drop-shadow-lg rounded-lg bg-white relative overflow-hidden"
    >
      <div
        ref={viewportRef}
        className="w-full h-full bg-[url(/grid.svg)] bg-center relative select-none"
        style={{ transform, transformOrigin: '0 0' }}
      >
        {children}
      </div>
    </div>
  )
}
