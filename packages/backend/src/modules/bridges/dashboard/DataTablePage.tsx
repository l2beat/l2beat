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
    dom: 'Bfrtip', // B = Buttons, f = filter, r = processing, t = table, i = info, p = pagination
    buttons: [
      'colvis', // Column visibility button
      'pageLength',
      'csv',
    ],
    ...dataTableOptions,
  }

  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* jQuery (DataTable dependency)*/}
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" />

        {/* DataTables Core */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css"
        />
        <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js" />

        {/* DataTables Buttons Extension */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css"
        />
        <script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js" />
        <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.colVis.min.js" />
        <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js" />

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
