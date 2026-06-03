'use client';
import {
    ColumnDef,
    createColumnHelper,
    createTable,
    getCoreRowModel,
    RowModel,
    Table,
    TableState,
    Updater,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import TableDisplay from './TableDisplay';

type EnemyRanks =
    | 'competent'
    | 'dangerous'
    | 'deadly'
    | 'elite'
    | 'expert'
    | 'harmless'
    | 'master'
    | 'mostlyharmless'
    | 'novice';

type PlayerRanks =
    | EnemyRanks
    | 'elitei'
    | 'eliteii'
    | 'eliteiii'
    | 'eliteiv'
    | 'elitev';

type Ranks = {
    [key: number]: PlayerRanks;
};

const enemyRanks = {
    0: 'harmless',
    1: 'mostlyharmless',
    2: 'novice',
    3: 'competent',
    4: 'expert',
    5: 'master',
    6: 'dangerous',
    7: 'deadly',
    8: 'elite',
} as const;

const playerRanks: Ranks = {
    ...enemyRanks,
    9: 'elitei',
    10: 'eliteii',
    11: 'eliteiii',
    12: 'eliteiv',
    13: 'elitev',
};

export const enemyRank = [
    'harmless',
    'mostlyharmless',
    'novice',
    'competent',
    'expert',
    'master',
    'dangerous',
    'deadly',
    'elite',
] as const;

export type EnemyRank = (typeof enemyRank)[number];

type Events = {
    Name: string | undefined;
    event: string;
    [key: string]: string | undefined;
};

type Kills = {
    [key: number]: {
        [key: number]: number;
    };
};

export type TableData = {
    rank: PlayerRanks;
} & Record<EnemyRank, number>;

export default function Main() {
    const [file, setFile] = useState<FileList | null>(null);
    const [submit, setSubmit] = useState<boolean>(false);
    const [events, setEvents] = useState<Events[]>([]);
    const [data, setData] = useState<TableData[]>([]);

    const parse = async (logFiles: FileList) => {
        const events = await parseLogFiles(logFiles);
        setEvents(events);
        console.log(events);
        const record: Kills = await parseEvents(events);
        console.log(record);

        const dataTemp: TableData[] = Object.entries(record).map(
            ([x, inner]) => ({
                rank: playerRanks[Number(x)],
                harmless: inner[0] ?? 0,
                mostlyharmless: inner[1] ?? 0,
                novice: inner[2] ?? 0,
                competent: inner[3] ?? 0,
                expert: inner[4] ?? 0,
                master: inner[5] ?? 0,
                dangerous: inner[6] ?? 0,
                deadly: inner[7] ?? 0,
                elite: inner[8] ?? 0,
            }),
        );

        console.log(dataTemp);
        setData(dataTemp);
    };

    const handler = (e: React.SyntheticEvent) => {
        if (e.currentTarget instanceof HTMLButtonElement) {
            if (e.currentTarget.name === 'submit') {
                if (file === null) {
                    setSubmit(false);
                } else {
                    setSubmit(true);
                    const events = parse(file);
                    console.log(events);
                }
            }
        }
    };

    return (
        <div className='relative w-full min-h-screen text-slate-100'>
            {/* SPACE BACKGROUND */}
            <div className='absolute inset-0 bg-linear-to-b from-black via-slate-950 to-black' />

            {/* HUD GRID OVERLAY */}
            <div className='pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:60px_60px]' />

            {/* SCANLINES */}
            <div className='pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] opacity-20' />

            <div className='relative z-10 flex gap-6 p-6'>
                {/* LEFT PANEL */}
                <aside className='w-72 flex flex-col gap-4'>
                    <div className='border border-cyan-500/30 bg-black/60 p-4 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)]'>
                        <div className='text-cyan-300 uppercase text-xs tracking-widest mb-2'>
                            Commander Interface
                        </div>

                        <input
                            type='file'
                            multiple
                            className='w-full text-xs bg-black border border-cyan-700/40 p-2 rounded'
                            onChange={(e) => setFile(e.target.files)}
                        />

                        <button
                            name='submit'
                            onClick={(e) => handler(e)}
                            className='mt-3 w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 uppercase text-xs tracking-widest'
                        >
                            Initiate Scan
                        </button>
                    </div>

                    <div className='border border-purple-500/20 bg-black/60 p-4 rounded-lg text-xs text-slate-400'>
                        <div className='text-purple-300 uppercase mb-2 tracking-widest'>
                            Navigation Status
                        </div>
                        <p>System scan ready</p>
                        <p>Telemetry: stable</p>
                        <p>Matrix link: offline</p>
                    </div>
                </aside>

                {/* CENTER PANEL (TABLE) */}
                <main className='flex-1'>
                    <div className='border border-cyan-500/30 rounded-xl bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(34,211,238,0.1)]'>
                        {submit && <TableDisplay data={data} />}
                    </div>
                </main>

                {/* RIGHT PANEL */}
                {/* <aside className="w-80 flex flex-col gap-4">

          <div className="border border-cyan-500/20 bg-black/60 p-4 rounded-lg">
            <div className="text-cyan-300 uppercase text-xs tracking-widest mb-2">
              Target Analysis
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>No target selected</p>
              <p>Awaiting matrix input...</p>
            </div>
          </div>

          <div className="border border-purple-500/20 bg-black/60 p-4 rounded-lg">
            <div className="text-purple-300 uppercase text-xs tracking-widest mb-2">
              Signal Noise
            </div>

            <div className="h-24 bg-gradient-to-t from-purple-500/10 to-transparent rounded" />
          </div>
        </aside> */}
            </div>
        </div>
    );
}

async function parseLogFiles(fileList: FileList) {
    const allEvents = [];

    for (const file of fileList) {
        const text = await file.text();

        const lines = text.split(/\r?\n/).filter(Boolean);

        for (const line of lines) {
            try {
                const obj = JSON.parse(line);
                allEvents.push(obj);
            } catch (err) {
                console.warn(
                    `Skipping invalid JSON line in ${file.name}:`,
                    line,
                );
            }
        }
    }

    allEvents.sort(
        (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return allEvents;
}

type Ship = {
    [key: string]: number;
};

async function parseEvents(events: Events[]) {
    const killRecord: Kills = Object.fromEntries(
        Array.from({ length: 14 }, (_, i) => [
            i,
            Object.fromEntries(Array.from({ length: 9 }, (_, j) => [j, 0])),
        ]),
    );
    let currentRank: number = 0;

    const ship: Ship = {};

    const reversedRanks = Object.fromEntries(
        Object.entries(enemyRanks).map(([k, v]) => [v, Number(k)]),
    );

    for (const event of events) {
        //console.log(ship)
        if (
            (event.event.toLowerCase() === 'rank' ||
                event.event.toLowerCase() === 'promotion') &&
            event['Combat']
        ) {
            const rank = Number(event['Combat']);
            if (!killRecord[rank]) {
                killRecord[rank] = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                };
            }

            currentRank = rank;
        } else if (
            event.event.toLowerCase() === 'shiptargeted' &&
            event['TargetLocked'] &&
            event['PilotName'] &&
            event['PilotRank']
        ) {
            const name = event['PilotName'];
            if (!Object.keys(ship).includes(name)) {
                const rank =
                    reversedRanks[
                        event['PilotRank'].toLowerCase().replace(' ', '')
                    ];
                ship[name] = rank;
            }
        } else if (event['Rewards'] && event['PilotName']) {
            const name = event['PilotName'];
            if (currentRank === 3) {
                console.log('kill');
            }
            if (Object.keys(ship).includes(name)) {
                const rank = ship[name];

                killRecord[currentRank][rank]++;

                delete ship[name];
            }
        }
    }

    return killRecord;
}
