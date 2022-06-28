import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import {createTable, useTableInstance, getCoreRowModel, getFilteredRowModel,} from '@tanstack/react-table'

import {RankingInfo, rankItem, rankings,} from '@tanstack/match-sorter-utils'
import {defaultData} from './defaultData';
import {Person} from './typings';

let table = createTable()
  .setRowType<Person>()
  .setFilterMetaType<RankingInfo>()
  .setOptions({
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), value, {
          threshold: rankings.MATCHES,
        })

        // Store the ranking info
        addMeta(itemRank)

        // Return if the item should be filtered in/out
        return itemRank.passed
      },
    },
  })

function App() {
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo(
    () => [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'Full Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createDataColumn('visits', {
        header: () => <span>Visits</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn('status', {
        header: 'Status',
        footer: props => props.column.id,
      }),
      table.createDataColumn('progress', {
        header: 'Profile Progress',
        footer: props => props.column.id,
      }),
    ],
    []
  )

  const instance = useTableInstance(table, {
    data: defaultData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div>
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={event => setGlobalFilter(event.target.value)}
          placeholder="Search all columns..."
        />
      </div>
      <div/>
      <table>
        <thead>
        {instance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (header.renderHeader())}
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody>
        {instance.getRowModel().rows.map(row => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderCell()}</td>)}
            </tr>
          )
        })}
        </tbody>
      </table>
      <div/>
      <pre>{JSON.stringify(instance.getState(), null, 2)}</pre>
    </div>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
