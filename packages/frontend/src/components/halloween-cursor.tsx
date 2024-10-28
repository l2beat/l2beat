'use client'
import { useEffect, useRef } from 'react'

export default function HalloweenCursor() {
  const cursorRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    const speed = 0.05

    function animate() {
      if (!cursor) return
      const distX = mouseX - cursorX - cursor.clientWidth / 2
      const distY = mouseY - cursorY - cursor.clientHeight / 2
      cursor.style.transform = `skew(${Math.min(Math.max(-distX * 0.1, -50), 50)}deg)`
      cursor.style.scale = `1 ${Math.min(Math.max(1 - distY / 250, 0.5), 1.5)}`
      cursor.style.filter = `blur(${Math.min(
        Math.max(Math.abs(distX / 30) + Math.abs(distY / 30), 0),
        2,
      )}px)`
      cursorX = cursorX + distX * speed
      cursorY = cursorY + distY * speed
      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`
      requestAnimationFrame(animate)
      if (mouseX !== 0 && mouseY !== 0) {
        cursor.style.display = 'block'
        cursor.style.opacity = '0.5'
      }
    }
    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <svg
      ref={cursorRef}
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none fixed z-[1000] hidden size-16 -translate-x-96 overflow-hidden fill-current align-middle opacity-0 blur-[1px] duration-75"
      style={{
        verticalAlign: 'middle',
        transition: 'transform,opacity 0.2s ease',
      }}
      width="96"
      height="96"
      viewBox="0 0 96 96"
      version="1.1"
    >
      <path
        className="dark:hidden"
        d="M35.9438 14.8274C25.9879 15.0177 11.7463 19.4369 3 33.7166C15.9412 28.1344 23.9464 42.6538 20.3388 49.8994C30.1479 49.8994 32.8046 62.7553 26.2676 67.7737C39.4954 67.7737 34.2658 77.2535 34.3777 80.1786C38.6635 73.37 47.0672 72.7991 49.0877 80.1786C51.5767 70.9172 61.8961 66.3852 67.9927 72.9612C71.7121 67.5411 86.513 66.4768 90.0298 77.8103C99.2165 55.249 84.7722 36.1976 78.0604 32.9272C76.1028 45.7902 69.4119 51.887 59.1554 46.6854C63.2804 44.0775 63.5181 35.0135 63.5181 35.0135C63.5181 35.0135 60.5817 37.0927 59.547 37.72C59.547 37.72 58.3514 36.4725 56.4707 35.521C54.59 34.5695 52.8911 34.3369 52.8911 34.3369C52.7722 33.1246 52.2758 29.1494 52.2758 29.1494C52.2758 29.1494 45.627 35.1404 46.0115 40.0318C35.755 34.8373 36.8876 25.9424 45.9556 16.6881C44.1028 15.5674 40.4673 14.7428 35.9438 14.8274Z"
        fill="black"
        fillOpacity="0.6"
      />
      <path
        className="hidden dark:block"
        d="M72.4249 34.6703C70.7505 34.2903 69.7293 31.2681 68.5418 27.7709C66.149 20.6934 62.5331 10 47.9921 10C33.1365 10 29.8412 19.9453 27.4365 27.2069C26.2312 30.8466 25.1862 33.9875 23.1318 34.7178C14.7837 37.6687 9.99805 44.3603 9.99805 53.0647C9.99805 53.8722 10.6274 54.5431 11.4349 54.5847C20.7865 55.0775 21.1368 59.5662 21.5049 64.3222C21.7365 67.2791 21.9977 70.6337 25.2634 71.7203L26.8546 72.2428C31.9668 73.9172 33.8787 74.5406 35.7549 78.5187C37.5065 82.2178 40.3209 86 47.9565 86H48.2593C55.8534 85.905 58.2759 81.9269 60.2234 78.7325C61.3396 76.9037 62.2184 75.4609 63.863 74.9681C71.2256 72.7534 72.2705 68.2231 73.1137 64.5834C74.0102 60.73 74.5981 58.1828 82.3465 58.1828C82.9818 58.1828 83.6587 58.2006 84.383 58.2422C84.7987 58.2303 85.2084 58.0641 85.5112 57.7791C85.814 57.4881 85.9862 57.0428 85.9862 56.6272C85.9862 48.2197 85.9862 37.7519 72.4249 34.6703ZM38.8721 35.8341C37.1918 35.8341 35.8321 33.7975 35.8321 31.2741C35.8321 28.7566 37.1918 26.7141 38.8721 26.7141C40.5524 26.7141 41.9121 28.7566 41.9121 31.2741C41.9121 33.7975 40.5524 35.8341 38.8721 35.8341ZM51.0321 35.8341C49.3518 35.8341 47.9921 33.7975 47.9921 31.2741C47.9921 28.7566 49.3518 26.7141 51.0321 26.7141C52.7124 26.7141 54.0721 28.7566 54.0721 31.2741C54.0721 33.7975 52.7124 35.8341 51.0321 35.8341Z"
        fill="white"
        fillOpacity="0.6"
      />
    </svg>
  )
}
