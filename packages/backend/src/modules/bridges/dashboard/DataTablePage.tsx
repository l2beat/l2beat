import React from 'react'

interface DataTablePageProps {
  title: string
  table: React.ReactNode
  tableId?: string
  dataTableOptions?: object
}

export function DataTablePage(props: DataTablePageProps) {
  const { title, table, tableId = 'myTable', dataTableOptions = {} } = props

  const defaultOptions = {
    pageLength: 25,
    order: [[0, 'desc']], // Default sort by first column
    ...dataTableOptions,
  }

  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css"
        />
        <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js" />

        <style>{`
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            margin: 20px 0;
          }
        `}</style>
      </head>
      <body>
        <h1>{title}</h1>

        {table}

        <script
          dangerouslySetInnerHTML={{
            __html: `
            $(document).ready(function() {
              $('#${tableId}').DataTable(${JSON.stringify(defaultOptions)});
            });
          `,
          }}
        />
      </body>
    </html>
  )
}
