'use client'

import { useEffect, useRef, useState } from 'react'

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

export default function Page() {
  const [sizes, setSizes] = useState<number[]>([])
  const headRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (!headRowRef.current) return

    const observer = new ResizeObserver((entries) => {
      const sizes = entries.map((entry) => entry.contentRect.width)
      console.log(entries)
      setSizes(sizes)
    })

    observer.observe(headRowRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])
  console.log(sizes)
  return (
    <main className="mx-auto mt-10 h-[200vh] max-w-screen-sm">
      Table POC Some text describing the table Some text describing the table
      Some text describing the table
      <table className="sticky top-0 z-100">
        <thead>
          <tr>
            <TableHeading>#</TableHeading>
            <TableHeading>Name</TableHeading>
            <TableHeading>Position</TableHeading>
            <TableHeading>Salary</TableHeading>
            <TableHeading>Age</TableHeading>
            <TableHeading>City</TableHeading>
          </tr>
        </thead>
      </table>
      <div className="relative -top-10 w-full overflow-x-auto">
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
                <TableData>{employee.id}</TableData>
                <TableData>{employee.name}</TableData>
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

function TableHeading(props: React.ComponentProps<'th'>) {
  return (
    <th className="h-10 border-b-2 border-black bg-white px-2" {...props} />
  )
}

function TableData(props: React.ComponentProps<'td'>) {
  return (
    <td className="h-10 whitespace-pre border-b border-black px-2" {...props} />
  )
}
