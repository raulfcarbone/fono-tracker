import React from 'react';

/**
 * ManualTable Component
 * Renders a table with inputs for manual data entry.
 * 
 * @param {Object} props
 * @param {Array} props.columns - [{ key, label, width }]
 * @param {Array} props.rows - [{ key, label }]
 * @param {Object} props.value - Data object { [rowKey]: { [colKey]: string } }
 * @param {Function} props.onChange - Callback `(newData) => void`
 * @param {Boolean} props.readOnly
 */
export function ManualTable({ columns, rows, value = {}, onChange, readOnly = false }) {

    const handleChange = (rowKey, colKey, text) => {
        if (readOnly) return;

        const rowData = value[rowKey] || {};
        const newData = {
            ...value,
            [rowKey]: {
                ...rowData,
                [colKey]: text
            }
        };
        onChange(newData);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white mb-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 min-w-[200px]">Ítem / Subtest</th>
                        {columns.map(col => (
                            <th key={col.key} className={`px-4 py-3 whitespace-nowrap border-l border-slate-200 ${col.width || ''}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((row, idx) => (
                        <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-4 py-2 font-medium text-slate-800 border-r border-slate-100">
                                {row.label}
                            </td>
                            {columns.map(col => {
                                const val = value[row.key]?.[col.key] || '';
                                return (
                                    <td key={col.key} className="p-0 border-r border-slate-100 last:border-0 relative">
                                        <input
                                            type="text"
                                            value={val}
                                            onChange={(e) => handleChange(row.key, col.key, e.target.value)}
                                            readOnly={readOnly}
                                            className={`w-full h-full px-4 py-2 bg-transparent outline-none focus:bg-violet-50 focus:ring-2 focus:ring-inset focus:ring-violet-500 transition-colors text-center ${readOnly ? 'cursor-default text-slate-600' : 'text-slate-900'}`}
                                            placeholder={readOnly ? '-' : ''}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
