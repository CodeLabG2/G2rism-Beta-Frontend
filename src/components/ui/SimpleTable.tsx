import React from 'react';

interface Column<T = any> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface SimpleTablePropsWithColumns<T = any> {
  columns: Column<T>[];
  data: T[];
  headers?: never;
  className?: string;
}

interface SimpleTablePropsWithHeaders {
  headers: string[];
  data: React.ReactNode[][];
  columns?: never;
  className?: string;
}

type SimpleTableProps<T = any> = SimpleTablePropsWithColumns<T> | SimpleTablePropsWithHeaders;

export function SimpleTable<T extends { id?: string | number }>({ 
  columns, 
  headers,
  data,
  className = ''
}: SimpleTableProps<T>) {
  // Validación de seguridad
  if (!data) {
    return null;
  }

  // Modo con headers (arrays de ReactNodes)
  if (headers) {
    return (
      <div className={`table-responsive ${className}`}>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="px-2 sm:px-3 md:px-4 py-2 md:py-3 text-left text-xs sm:text-sm text-gray-600 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data as React.ReactNode[][]).map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 sm:px-3 md:px-4 py-2 md:py-4 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Modo con columns (objetos con keys)
  if (!columns) {
    return null;
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="px-2 sm:px-3 md:px-4 py-2 md:py-3 text-left text-xs sm:text-sm text-gray-600 whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data as T[]).map((row, index) => (
            <tr
              key={(row as any).id || index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-2 sm:px-3 md:px-4 py-2 md:py-4 text-sm">
                  {column.render ? column.render(row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}