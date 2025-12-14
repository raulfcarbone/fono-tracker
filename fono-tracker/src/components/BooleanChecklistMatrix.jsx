import React from 'react';
import clsx from 'clsx';

/**
 * Componente para Checklist Booleano (Matriz)
 * 
 * @param {Object} props
 * @param {Object} props.value - State { [rowId]: { [colId]: boolean } }
 * @param {Function} props.onChange - Handler
 * @param {boolean} props.readOnly
 * @param {Array} props.rows - Categories and Items { category: string, items: [] }
 * @param {Array} props.columns - Forms { label: string, subItems: [] }
 */
export function BooleanChecklistMatrix({ value = {}, onChange, readOnly = false, rows, columns }) {

    const toggleCheck = (rowItem, colItem) => {
        if (readOnly) return;

        const currentRow = value[rowItem] || {};
        const isChecked = !!currentRow[colItem];

        onChange({
            ...value,
            [rowItem]: {
                ...currentRow,
                [colItem]: !isChecked
            }
        });
    };

    // Helper to count totals per column
    const getColumnTotal = (colItem) => {
        let total = 0;
        Object.values(value).forEach(rowVal => {
            if (rowVal && rowVal[colItem]) total++;
        });
        return total;
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse border border-slate-300 text-xs md:text-sm">
                <thead>
                    {/* Header Row 1: Forms Categories */}
                    <tr className="bg-slate-100">
                        <th rowSpan={2} className="p-2 border border-slate-300 min-w-[200px] text-left">
                            Funciones Comunicativas
                        </th>
                        {columns.map(group => (
                            <th
                                key={group.label}
                                colSpan={group.subItems.length}
                                className="p-2 border border-slate-300 text-center font-bold bg-slate-200"
                            >
                                {group.label}
                            </th>
                        ))}
                    </tr>
                    {/* Header Row 2: Specific Forms */}
                    <tr className="bg-slate-50">
                        {columns.flatMap(group => group.subItems.map(item => (
                            <th key={item} className="p-2 border border-slate-300 min-w-[40px] max-w-[80px] text-center font-medium rotate-45 h-32 align-bottom">
                                <span className="block">{item}</span>
                            </th>
                        )))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((categoryGroup, catIndex) => (
                        <React.Fragment key={catIndex}>
                            {/* Category Header */}
                            <tr className="bg-slate-100 font-bold">
                                <td className="p-2 border border-slate-300" colSpan={1 + columns.reduce((acc, g) => acc + g.subItems.length, 0)}>
                                    {categoryGroup.category}
                                </td>
                            </tr>
                            {/* Items */}
                            {categoryGroup.items.map(rowItem => (
                                <tr key={rowItem} className="hover:bg-slate-50">
                                    <td className="p-2 border border-slate-300 font-medium">
                                        {rowItem}
                                    </td>
                                    {columns.flatMap(group => group.subItems.map(colItem => {
                                        const isChecked = value[rowItem]?.[colItem];
                                        return (
                                            <td
                                                key={`${rowItem} -${colItem} `}
                                                className="p-1 border border-slate-300 text-center cursor-pointer"
                                                onClick={() => toggleCheck(rowItem, colItem)}
                                            >
                                                <div className={clsx(
                                                    "w-5 h-5 mx-auto rounded border transition-colors",
                                                    isChecked
                                                        ? "bg-blue-600 border-blue-600"
                                                        : "bg-white border-slate-300 hover:border-blue-400"
                                                )}>
                                                    {isChecked && <span className="text-white block text-center leading-4 text-xs">✓</span>}
                                                </div>
                                            </td>
                                        );
                                    }))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-slate-100 font-bold">
                        <td className="p-2 border border-slate-300 text-right">TOTAL</td>
                        {columns.flatMap(group => group.subItems.map(colItem => (
                            <td key={colItem} className="p-2 border border-slate-300 text-center">
                                {getColumnTotal(colItem)}
                            </td>
                        )))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
