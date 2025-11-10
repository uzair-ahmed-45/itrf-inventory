import { motion } from 'framer-motion';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse bg-white" style={{ minWidth: '1000px' }}>
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ width: column.width || 'auto' }}
                className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  hover:bg-blue-50 text-center transition-colors duration-150
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ width: column.width || 'auto' }}
                    className={`px-4 py-3.5  text-sm text-gray-700 align-top ${
                      column.accessor === 'SNO' ? 'font-medium text-center' : ''
                    }`}
                  >
                    {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

