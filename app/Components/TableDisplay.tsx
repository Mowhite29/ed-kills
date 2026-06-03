import {
    useReactTable,
    RowModel,
    createColumnHelper,
    flexRender,
    ColumnDef,
    Table,
    getCoreRowModel,
} from '@tanstack/react-table';
import { enemyRank, TableData } from './Main';

const rankDisplay = {
    harmless: 'Harmless',
    mostlyharmless: 'Mostly Harmless',
    novice: 'Novice',
    competent: 'Competent',
    expert: 'Expert',
    master: 'Master',
    dangerous: 'Dangerous',
    deadly: 'Deadly',
    elite: 'Elite',
    elitei: 'Elite I',
    eliteii: 'Elite II',
    eliteiii: 'Elite III',
    eliteiv: 'Elite IV',
    elitev: 'Elite V',
};

type TableDisplayProps = {
    data: TableData[];
};

export default function TableDisplay({ data }: TableDisplayProps) {
    const columnHelper = createColumnHelper<TableData>();

    const columns = [
        columnHelper.accessor('rank', {
            header: 'Rank',
        }),
        ...enemyRank.map((rank) =>
            columnHelper.accessor(rank, {
                header: rankDisplay[rank],
            }),
        ),
    ] satisfies ColumnDef<TableData, any>[];

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='relative overflow-auto rounded-xl border border-cyan-500/30 bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)]'>
            {/* HUD grid overlay */}
            <div className='pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:40px_40px]' />

            <table className='min-w-full border-collapse text-sm relative z-10'>
                {/* HEADER */}
                <thead className='bg-black/80 text-cyan-300 uppercase tracking-widest text-xs'>
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className='
                            sticky top-0 z-20
                            px-3 py-2
                            border-b border-cyan-500/20
                            bg-black/90
                            text-left
                            font-semibold
                            shadow-[0_0_10px_rgba(34,211,238,0.2)]
                        '
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className='bg-gray-900 text-slate-200'>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className='
                        hover:bg-cyan-500/10
                        transition
                        odd:bg-black/40z
                        even:bg-black/20
                    '
                        >
                            {row.getVisibleCells().map((cell: any) => {
                                const value = cell.getValue?.();
                                const intensity = Math.min(value / 50, 1);
                                return (
                                    <td
                                        key={cell.id}
                                        className='
                                px-3 py-2
                                text-center
                                border-b border-cyan-500/10
                                relative
                                '
                                    >
                                        <div
                                            className='
                                    relative z-10
                                    font-mono
                                '
                                            style={{
                                                backgroundColor: `rgba(34, 211, 238, ${intensity * 0.25})`,
                                                boxShadow: `0 0 ${10 * intensity}px rgba(34,211,238,${intensity})`,
                                                color:
                                                    intensity > 0.6
                                                        ? '#67e8f9'
                                                        : '#cbd5f5',
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </div>

                                        {/* HUD glow overlay per cell */}
                                        <div className='absolute inset-0 opacity-0 hover:opacity-100 transition bg-cyan-400/5 blur-md' />
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
