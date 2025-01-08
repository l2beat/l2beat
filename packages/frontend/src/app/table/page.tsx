'use client'

import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const [sizes, setSizes] = useState<number[]>([])
  const headRowRef = useRef<HTMLTableRowElement>(null)
  const [shortName, setShortName] = useState(false)
  const scrollableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headRowRef.current) return
    function updateSizes() {
      const sizes = Array.from(headRowRef.current?.children ?? []).map(
        (child) => {
          return child.getBoundingClientRect().width
        },
      )
      setSizes(sizes)
    }

    updateSizes()

    const observer = new ResizeObserver(updateSizes)
    observer.observe(headRowRef.current)
    window.addEventListener('resize', updateSizes)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSizes)
    }
  }, [])

  return (
    <main className="mx-auto mt-10 h-[200vh] max-w-screen-lg">
      Table POC
      <div className="sticky top-0 z-[200] h-10 bg-brand text-white">Tabs</div>
      Some text describing the table Some text describing the table Some text
      describing the table.
      <button onClick={() => setShortName(!shortName)}>Short Name</button>
      <StickyHeader sizes={sizes} scrollableRef={scrollableRef} />
      <div
        className="relative -top-10 w-full overflow-x-auto"
        ref={scrollableRef}
      >
        <table
          className="w-full border-separate"
          cellSpacing={0}
          cellPadding={0}
        >
          <thead>
            <tr ref={headRowRef}>
              <TableHeading>#</TableHeading>
              <TableHeading>Name</TableHeading>
              <TableHeading>Position</TableHeading>
              <TableHeading>Salary</TableHeading>
              <TableHeading>Age</TableHeading>
              <TableHeading>City</TableHeading>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <TableData style={{ position: 'sticky', left: 0 }}>
                  {employee.id}
                </TableData>
                <TableData
                  style={{
                    position: 'sticky',
                    left: sizes[0],
                  }}
                >
                  {shortName ? employee.name.slice(0, 10) : employee.name}
                </TableData>
                <TableData>{employee.position}</TableData>
                <TableData>{employee.salary}</TableData>
                <TableData>61</TableData>
                <TableData>New York</TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function StickyHeader({
  sizes,
  scrollableRef,
}: { sizes: number[]; scrollableRef: React.RefObject<HTMLDivElement | null> }) {
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    if (!scrollableRef.current) return
    const container = scrollableRef.current
    function handleScroll() {
      setScrollLeft(container.scrollLeft)
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [scrollableRef])

  return (
    <div
      className="sticky top-10 z-100 w-full overflow-hidden "
      aria-hidden="true"
    >
      <table className="relative" style={{ left: -scrollLeft }}>
        <thead>
          <tr>
            <TableHeading
              style={{
                minWidth: sizes[0],
                position: 'sticky',
                left: 0,
              }}
            >
              #
            </TableHeading>
            <TableHeading
              style={{ minWidth: sizes[1], position: 'sticky', left: sizes[0] }}
            >
              Name
            </TableHeading>
            <TableHeading style={{ minWidth: sizes[2] }}>Position</TableHeading>
            <TableHeading style={{ minWidth: sizes[3] }}>Salary</TableHeading>
            <TableHeading style={{ minWidth: sizes[4] }}>Age</TableHeading>
            <TableHeading style={{ minWidth: sizes[5] }}>City</TableHeading>
          </tr>
        </thead>
      </table>
    </div>
  )
}

function TableHeading(props: React.ComponentProps<'th'>) {
  return (
    <th
      className="h-10 border-b-2 border-black bg-white px-2 text-left"
      {...props}
    />
  )
}

function TableData(props: React.ComponentProps<'td'>) {
  return (
    <td
      className="h-10 whitespace-pre border-b border-black bg-white px-2"
      {...props}
    />
  )
}

const employees = [
  {
    id: 1,
    name: 'Tiger Nixon',
    position: 'System Architect',
    salary: '$320,800',
  },
  {
    id: 2,
    name: 'Garrett Winters',
    position: 'Accountant',
    salary: '$170,750',
  },
  {
    id: 3,
    name: 'Ashton Cox',
    position: 'Junior Technical Author',
    salary: '$86,000',
  },
  {
    id: 4,
    name: 'Cedric Kelly',
    position: 'Senior Javascript Developer',
    salary: '$433,060',
  },
  {
    id: 5,
    name: 'Airi Satou',
    position: 'Accountant',
    salary: '$162,700',
  },
  {
    id: 6,
    name: 'Brielle Williamson',
    position: 'Integration Specialist',
    salary: '$372,000',
  },
  {
    id: 7,
    name: 'Herrod Chandler',
    position: 'Sales Assistant',
    salary: '$137,500',
  },
  {
    id: 8,
    name: 'Rhona Davidson',
    position: 'Integration Specialist',
    salary: '$327,900',
  },
  {
    id: 9,
    name: 'Colleen Hurst',
    position: 'Javascript Developer',
    salary: '$205,500',
  },
  {
    id: 10,
    name: 'Sonya Frost',
    position: 'Software Engineer',
    salary: '$103,600',
  },
  {
    id: 11,
    name: 'Jena Gaines',
    position: 'Office Manager',
    salary: '$90,560',
  },
  {
    id: 12,
    name: 'Quinn Flynn',
    position: 'Support Lead',
    salary: '$342,000',
  },
  {
    id: 13,
    name: 'Charde Marshall',
    position: 'Regional Director',
    salary: '$470,600',
  },
]
