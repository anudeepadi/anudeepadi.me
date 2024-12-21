// app/components/widgets/TableWidget.tsx
import { TableValueProps } from "@/types";

export function TableWidget(props: TableValueProps) {
  const { table, caption } = props;
  const rows = table?.rows || [];
  
  if (!rows.length) {
    return <div className="p-4 text-gray-500">Empty table</div>;
  }

  return (
    <div className="p-4">
      {caption && (
        <div className="mb-2">
          <em className="not-italic text-sm font-semibold">{caption}</em>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border dark:border-zinc-800 border-zinc-200">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border dark:border-zinc-800 border-zinc-200 p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}