import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  filters?: React.ReactNode;
  addButtonLabel?: string;
}

export function DataTable({
  title,
  columns,
  data,
  onAdd,
  onView,
  onEdit,
  onDelete,
  filters,
  addButtonLabel = 'Nuevo',
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  let filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aValue > bValue ? modifier : -modifier;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h4 className="text-lg sm:text-xl">{title}</h4>
        {onAdd && (
          <Button
            onClick={onAdd}
            icon={<span className="text-lg">+</span>}
            size="sm"
            className="w-full sm:w-auto"
          >
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <div className="flex-1 min-w-full sm:min-w-[200px]">
              <Input
                type="text"
                placeholder="Buscar..."
                icon={<Search size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">{filters}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Filter size={16} />}
              className="flex-1 sm:flex-none"
            >
              Filtrar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="flex-1 sm:flex-none"
            >
              Limpiar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={16} />}
              className="flex-1 sm:flex-none"
            >
              Exportar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={16} />}
              className="flex-1 sm:flex-none"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-gray-600 whitespace-nowrap"
                  >
                    <button
                      onClick={() => column.sortable && handleSort(column.key)}
                      className={`flex items-center gap-1 sm:gap-2 ${
                        column.sortable ? 'hover:text-gray-900 cursor-pointer' : ''
                      }`}
                    >
                      {column.label}
                      {column.sortable && (
                        <ArrowUpDown
                          size={14}
                          className={
                            sortColumn === column.key ? 'text-[#3A7AFE]' : 'text-gray-400'
                          }
                        />
                      )}
                    </button>
                  </th>
                ))}
                <th
                  className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-gray-600 whitespace-nowrap"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Ver"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} className="text-[#3A7AFE]" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-[#EF4444]" />
                        </button>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === index ? null : index)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>
                        <AnimatePresence>
                          {showActionMenu === index && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActionMenu(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden"
                              >
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                                  Duplicar
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                                  Archivar
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)}{' '}
              de {filteredData.length}
            </span>
            <Select
              options={[
                { value: '5', label: '5 por página' },
                { value: '10', label: '10 por página' },
                { value: '25', label: '25 por página' },
                { value: '50', label: '50 por página' },
              ]}
              value={String(itemsPerPage)}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs sm:text-sm w-full sm:w-auto"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm ${
                      currentPage === pageNum
                        ? 'bg-[#3A7AFE] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden px-3 py-1 bg-gray-100 rounded text-xs text-gray-700">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}