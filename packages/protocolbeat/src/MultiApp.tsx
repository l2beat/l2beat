import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { create } from 'zustand'

type State = {
  mouse: {
    x: number
    y: number
  }
  frames: {
    id: string
    flex: number
    hover: boolean
    collapsed: boolean
  }[]
}

type Action = {
  mouseMove: (x: number, y: number) => void
  pickUp: (id: string) => void
  order: (id: string, before: boolean) => void
  drop: () => void
  collapse: (id: string) => void
}

const useStore = create<State & Action>((set) => ({
  mouse: { x: 0, y: 0 },
  frames: [
    { id: 'frame-a', flex: 1, hover: false, collapsed: false },
    { id: 'frame-b', flex: 1, hover: false, collapsed: false },
    { id: 'frame-c', flex: 1, hover: false, collapsed: false },
    { id: 'frame-d', flex: 1, hover: false, collapsed: false },
    { id: 'frame-e', flex: 1, hover: false, collapsed: false },
  ],
  mouseMove: (x: number, y: number) => set(() => ({ mouse: { x, y } })),
  pickUp: (frameId: string) =>
    set((state) => ({
      frames: state.frames.map((frame) =>
        frame.id === frameId ? { ...frame, hover: true } : frame,
      ),
    })),
  order: (frameId: string, before: boolean) =>
    set((state) => {
      const target = state.frames.find((f) => f.id === frameId && !f.hover)
      const hover = state.frames.find((f) => f.hover)
      if (!target || !hover) {
        return state
      }
      const frames = []
      for (const frame of state.frames) {
        if (frame === target) {
          if (before) {
            frames.push(hover, frame)
          } else {
            frames.push(frame, hover)
          }
        } else if (!frame.hover) {
          frames.push(frame)
        }
      }
      return { frames }
    }),
  drop: () =>
    set((state) => ({
      frames: state.frames.map((frame) =>
        frame.hover ? { ...frame, hover: false } : frame,
      ),
    })),
  collapse: (frameId: string) =>
    set((state) => {
      const frames = state.frames.map((frame) =>
        frame.id === frameId
          ? { ...frame, collapsed: !frame.collapsed }
          : frame,
      )
      if (frames.some((x) => !x.collapsed)) {
        return { frames }
      }
      return state
    }),
}))

const DEFAULT_FRAME = { color: '#ff003b', name: 'RED' }
const FRAME_INFO: Record<string, { color: string; name: string }> = {
  'frame-a': { color: '#ff003b', name: 'RED' },
  'frame-b': { color: '#feff00', name: 'YELLOW' },
  'frame-c': { color: '#01ffb1', name: 'GREEN' },
  'frame-d': { color: '#00c1ff', name: 'BLUE' },
  'frame-e': { color: '#ff019c', name: 'PINK' },
}

export function MultiApp() {
  const frames = useStore((state) => state.frames)
  const mouseMove = useStore((state) => state.mouseMove)
  const pickUp = useStore((state) => state.pickUp)
  const drop = useStore((state) => state.drop)
  const order = useStore((state) => state.order)
  const collapse = useStore((state) => state.collapse)

  useEffect(() => {
    const frames = [...document.querySelectorAll('[data-frame]')].map(
      (frame) => ({
        id: frame.id,
        frame,
        // biome-ignore lint/style/noNonNullAssertion: We know it's there
        header: frame.querySelector('[data-frame-header]')!,
      }),
    )
    let hover: string | undefined
    let candidate: string | undefined
    const moveStart = { x: 0, y: 0 }

    function onMouseMove(e: MouseEvent) {
      mouseMove(e.clientX, e.clientY)
      if (candidate) {
        const distanceX = moveStart.x - e.clientX
        const distanceY = moveStart.y - e.clientY
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY,
        )
        if (distance > 10) {
          pickUp(candidate)
          hover = candidate
          candidate = undefined
        }
      }

      if (hover) {
        for (const frame of frames) {
          const box = frame.frame.getBoundingClientRect()
          if (e.clientX >= box.left && e.clientX < box.right) {
            if (frame.id !== hover) {
              order(frame.id, e.clientX < (box.left + box.right) / 2)
            }
            break
          }
        }
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button === 0) {
        for (const frame of frames) {
          const box = frame.header.getBoundingClientRect()
          if (
            e.clientX > box.left &&
            e.clientX < box.right &&
            e.clientY > box.top &&
            e.clientY < box.bottom
          ) {
            moveStart.x = e.clientX
            moveStart.y = e.clientY
            candidate = frame.id
            hover = undefined
            break
          }
        }
      }
    }

    function onMouseUp(e: MouseEvent) {
      if (e.button === 0) {
        if (candidate) {
          collapse(candidate)
        } else {
          drop()
        }
        candidate = undefined
        hover = undefined
      }
    }

    function onBlur() {
      drop()
      candidate = undefined
      hover = undefined
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  const noSelect = frames.some((f) => f.hover)

  return (
    <div
      className={clsx('flex h-full w-full flex-col', noSelect && 'select-none')}
    >
      <div className="h-10">TOP BAR</div>
      <div className="flex flex-1">
        {frames.map((frame) => {
          const info = FRAME_INFO[frame.id] ?? DEFAULT_FRAME
          return (
            <Frame
              key={frame.id}
              id={frame.id}
              color={info.color}
              header={`${info.name} HEADER`}
            >
              {info.name} CONTENT
            </Frame>
          )
        })}
      </div>
    </div>
  )
}

function Frame(props: {
  id: string
  color: string
  header: string
  children: ReactNode
}) {
  const frame = useStore((state) => state.frames.find((x) => x.id === props.id))
  if (!frame) {
    return null
  }

  return (
    <div
      data-frame
      className={clsx(
        'flex flex-col',
        !frame.collapsed ? 'flex-1' : 'w-[36px]',
      )}
      id={props.id}
    >
      <div
        data-frame-header
        className={clsx(
          'cursor-pointer select-none border border-black border-y-2 bg-slate-100',
          !frame.collapsed && 'h-[36px] px-[7px] py-1',
          frame.collapsed && 'h-full w-[36px] px-1 py-[7px]',
          frame.hover && 'hidden',
        )}
      >
        <div
          style={{
            textOrientation: frame.collapsed ? 'mixed' : undefined,
            writingMode: frame.collapsed ? 'vertical-rl' : undefined,
          }}
        >
          {props.header}
        </div>
      </div>
      {!frame.collapsed && (
        <div
          className={clsx('flex-1 px-2 py-1', frame.hover && 'hidden')}
          style={{ backgroundColor: props.color }}
        >
          {props.children}
        </div>
      )}
      {frame.hover && (
        <>
          <HoverHeader>{props.header}</HoverHeader>
          <div className="flex-1 bg-slate-300" />
        </>
      )}
    </div>
  )
}

function HoverHeader(props: { children: ReactNode }) {
  const mouse = useStore((state) => state.mouse)

  return (
    <div
      style={{ left: mouse.x - 100, top: mouse.y - 18 }}
      className="fixed h-[36px] w-[200px] cursor-move select-none border-2 border-black bg-slate-100 px-[7px] py-1"
    >
      {props.children}
    </div>
  )
}
