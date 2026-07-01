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
    Rewards?: [
        {
            Faction: string;
            Reward: number;
        },
    ];
    TargetLocked?: boolean;
    Ship?: string;
    PilotName?: string;
    PilotRank?: string;
    StarSystem?: string;
    timestamp: string;
    Combat?: number;
};

type Kills = {
    [key: number]: {
        [key: number]: number;
    };
};

type TopShips = {
    name: string;
    kills: number;
};

type TopSystem = {
    name: string;
    kills: number;
    bounty: number;
    ship: TopShips;
    lastVisit: string;
};

type TopStats = {
    kills: number;
    ship: TopShips;
    bounty: number;
};

export type TableData = {
    rank: PlayerRanks;
} & Record<EnemyRank, number>;

export default function Main() {
    const [file, setFile] = useState<FileList | null>(null);
    const [submit, setSubmit] = useState<boolean>(false);
    const [events, setEvents] = useState<Events[]>([]);
    const [data, setData] = useState<TableData[]>([]);
    const [status, setStatus] = useState<string>('Awaiting Input');
    const [system, setSystem] = useState<TopSystem>();
    const [topStats, setTopStats] = useState<TopStats>();

    const parse = async (logFiles: FileList) => {
        const events = await parseLogFiles(logFiles);
        setEvents(events);
        console.log(events);
        const stats = await parseEvents(events);
        const record = stats.killRecord;
        console.log(stats.topSystem);
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
        setSystem(stats.topSystem);
        setTopStats({
            kills: stats.totalKills,
            bounty: stats.totalBounties,
            ship: stats.topShips[0],
        });
    };

    const handler = (e: React.SyntheticEvent) => {
        if (e.currentTarget instanceof HTMLButtonElement) {
            if (e.currentTarget.name === 'submit') {
                if (file === null) {
                    setSubmit(false);
                } else {
                    setStatus('ANALYSING');
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

            {/* MOBILE WARNING */}
            <div className='relative z-20 flex min-h-screen items-center justify-center p-6 md:hidden'>
                <div
                    className='w-full max-w-md border border-cyan-500/30 
                    bg-black/70 backdrop-blur-md 
                    rounded-xl 
                    p-6 
                    text-center
                    shadow-[0_0_40px_rgba(34,211,238,0.15)]'
                >
                    <div className='text-cyan-300 uppercase text-xs tracking-[0.3em] mb-4'>
                        Commander Interface
                    </div>

                    <h1 className='text-xl font-light tracking-widest uppercase text-cyan-100 mb-4'>
                        Desktop Terminal Required
                    </h1>

                    <p className='text-sm text-slate-400 leading-relaxed'>
                        Combat Telemetry is optimized for desktop systems. The
                        analysis interface requires a larger display for full
                        tactical data visualization.
                    </p>

                    <div
                        className='mt-5 border-t border-cyan-500/20 pt-4 
                        text-[10px] uppercase tracking-widest text-cyan-400/70'
                    >
                        Recommended Resolution: 1280×720+
                    </div>
                </div>
            </div>
            <div className='hidden md:block'>
                {/* HUD GRID OVERLAY */}
                <div className='pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:60px_60px]' />

                {/* SCANLINES */}
                <div className='pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] opacity-20' />

                <div className='relative z-10 p-6'>
                    {/* PAGE TITLE */}
                    <header className='mb-6 border border-cyan-500/30 bg-black/50 backdrop-blur-md rounded-xl p-5 shadow-[0_0_30px_rgba(34,211,238,0.15)]'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' />

                            <div>
                                <h1 className='text-3xl font-light tracking-[0.35em] uppercase text-cyan-200'>
                                    Combat Telemetry
                                </h1>

                                <p className='mt-1 text-xs tracking-[0.25em] uppercase text-slate-400'>
                                    Elite Dangerous Kill Data Analysis Interface
                                </p>
                            </div>
                        </div>

                        <div className='mt-4 flex gap-6 text-[10px] uppercase tracking-widest text-cyan-400/70'>
                            <span>◈ Archive Link: Online</span>
                            <span>◈ Telemetry Parser: Ready</span>
                            <span>◈ Combat Logs: {status}</span>
                        </div>
                    </header>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pb-4'>
                        {/* TOTAL KILLS */}
                        <div className='rounded-lg border border-cyan-500/30 bg-black/60 p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)]'>
                            <p className='text-[10px] uppercase tracking-[0.25em] text-cyan-300'>
                                Confirmed Kills
                            </p>

                            <p className='mt-3 text-4xl font-light text-cyan-100'>
                                {topStats?.kills ? topStats?.kills : 100}
                            </p>

                            <div className='mt-4 h-1 rounded-full bg-cyan-500/20 overflow-hidden'>
                                <div className='h-full w-3/4 bg-cyan-400' />
                            </div>
                        </div>

                        {/* TOTAL BOUNTY */}
                        <div className='rounded-lg border border-purple-500/30 bg-black/60 p-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]'>
                            <p className='text-[10px] uppercase tracking-[0.25em] text-purple-300'>
                                Bounty Collected
                            </p>

                            <p className='mt-3 text-3xl font-light text-purple-200 break-words'>
                                {topStats?.bounty
                                    ? topStats?.bounty
                                    : 100000000}{' '}
                                CR
                            </p>

                            <div className='mt-4 h-1 rounded-full bg-purple-500/20 overflow-hidden'>
                                <div className='h-full w-4/5 bg-purple-400' />
                            </div>
                        </div>

                        {/* MOST DESTROYED SHIP */}
                        <div className='rounded-lg border border-amber-500/30 bg-black/60 p-4 shadow-[0_0_20px_rgba(251,191,36,0.15)]'>
                            <p className='text-[10px] uppercase tracking-[0.25em] text-amber-300'>
                                Primary Target
                            </p>

                            <h3 className='mt-3 text-2xl font-light text-amber-100 break-words'>
                                {topStats?.ship.name
                                    ? topStats?.ship.name.replaceAll('_', ' ')
                                    : 'anaconda'}
                            </h3>

                            <p className='mt-2 text-sm uppercase tracking-widest text-amber-300'>
                                {topStats?.ship.kills
                                    ? topStats?.ship.kills
                                    : '200'}{' '}
                                Eliminations
                            </p>

                            <div className='mt-4 h-1 rounded-full bg-amber-500/20 overflow-hidden'>
                                <div className='h-full w-2/3 bg-amber-400' />
                            </div>
                        </div>
                    </div>

                    {/* MAIN HUD LAYOUT */}
                    <div className='flex gap-6'>
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

                            <div className='border border-cyan-500/30 bg-black/60 rounded-lg p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)]'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
                                    <div>
                                        <p className='text-cyan-300 uppercase tracking-[0.25em] text-[10px] sm:text-xs'>
                                            Primary Kill Zone
                                        </p>

                                        <h2 className='mt-1 text-xl sm:text-2xl lg:text-3xl font-light tracking-[0.15em] uppercase text-cyan-100 break-words'>
                                            {system?.name
                                                ? system?.name
                                                : 'Sol'}
                                        </h2>
                                    </div>

                                    <div className='sm:text-right'>
                                        <p className='text-[10px] uppercase tracking-widest text-slate-500'>
                                            Combat Rating
                                        </p>

                                        <p className='text-green-400 font-semibold tracking-widest'>
                                            {system?.kills
                                                ? system?.kills < 11
                                                    ? 'LOW'
                                                    : system?.kills < 26
                                                      ? 'MODERATE'
                                                      : system?.kills < 51
                                                        ? 'HIGH'
                                                        : system?.kills < 11
                                                          ? 'EXTREME'
                                                          : 'WARZONE'
                                                : 'HIGH'}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='border border-cyan-500/20 rounded-lg p-3 bg-cyan-500/5'>
                                        <p className='text-[10px] uppercase tracking-widest text-slate-400'>
                                            Confirmed Kills
                                        </p>

                                        <p className='mt-2 text-2xl sm:text-3xl font-light text-cyan-200'>
                                            {system?.kills
                                                ? system?.kills
                                                : 148}
                                        </p>
                                    </div>

                                    <div className='border border-purple-500/20 rounded-lg p-3 bg-purple-500/5'>
                                        <p className='text-[10px] uppercase tracking-widest text-slate-400'>
                                            Bounty Collected
                                        </p>

                                        <p className='mt-2 text-lg sm:text-xl font-light text-purple-300 break-words'>
                                            {system?.bounty
                                                ? system?.bounty
                                                : 42350000}{' '}
                                            CR
                                        </p>
                                    </div>

                                    <div className='col-span-2 border border-cyan-500/20 rounded-lg p-3'>
                                        <p className='text-[10px] uppercase tracking-widest text-slate-400'>
                                            Most Destroyed Vessel
                                        </p>

                                        <div className='mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1'>
                                            <span className='text-cyan-100'>
                                                {system?.ship.name
                                                    ? system?.ship.name.replaceAll(
                                                          '_',
                                                          ' ',
                                                      )
                                                    : 'anaconda'}
                                            </span>

                                            <span className='text-cyan-300 text-sm'>
                                                {system?.ship.kills
                                                    ? system?.ship.kills
                                                    : 37}{' '}
                                                Eliminations
                                            </span>
                                        </div>
                                    </div>

                                    <div className='col-span-2 border border-cyan-500/20 rounded-lg p-3'>
                                        <p className='text-[10px] uppercase tracking-widest text-slate-400'>
                                            Last Recorded Engagement
                                        </p>

                                        <p className='mt-2 text-sm sm:text-base text-cyan-200 break-words'>
                                            {system?.lastVisit
                                                ? system?.lastVisit
                                                : '14-5-3311'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* CENTER PANEL */}
                        <main className='flex-1'>
                            <div className='border border-cyan-500/30 rounded-xl bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(34,211,238,0.1)]'>
                                {submit && <TableDisplay data={data} />}
                            </div>
                        </main>

                        {/* RIGHT PANEL */}
                        <aside className='w-80 flex flex-col gap-4'>
                            <div className='border border-cyan-500/20 bg-black/60 p-4 rounded-lg'>
                                <div className='text-cyan-300 uppercase text-xs tracking-widest mb-2'>
                                    Target Analysis
                                </div>

                                <div className='text-xs text-slate-400 space-y-1'>
                                    <p>No target selected</p>
                                    <p>Awaiting matrix input...</p>
                                </div>
                            </div>

                            <div className='border border-purple-500/20 bg-black/60 p-4 rounded-lg'>
                                <div className='text-purple-300 uppercase text-xs tracking-widest mb-2'>
                                    Signal Noise
                                </div>

                                <div className='h-24 bg-gradient-to-t from-purple-500/10 to-transparent rounded' />
                            </div>
                        </aside>
                    </div>
                </div>
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
    [key: string]: {
        rank: number;
        shipType: string;
    };
};

type System = {
    [key: string]: {
        kills: number;
        bounty: number;
        ships: ShipType;
        lastVisit: string;
    };
};

type ShipType = {
    [key: string]: number;
};

type TopSystems = {
    name: string;
    specs: {
        kills: number;
        bounty: number;
        ships: ShipType;
        lastVisit: string;
    };
};

async function parseEvents(events: Events[]) {
    const killRecord: Kills = Object.fromEntries(
        Array.from({ length: 14 }, (_, i) => [
            i,
            Object.fromEntries(Array.from({ length: 9 }, (_, j) => [j, 0])),
        ]),
    );
    let currentRank: number = 0;

    let totalKills: number = 0;

    let totalBounties: number = 0;

    const ship: Ship = {};

    const system: System = {
        unknown: {
            kills: 0,
            ships: {},
            bounty: 0,
            lastVisit: '',
        },
    };

    const shipType: ShipType = {};

    let currentSystem: string = 'unknown';

    const reversedRanks = Object.fromEntries(
        Object.entries(enemyRanks).map(([k, v]) => [v, Number(k)]),
    );

    for (const event of events) {
        //console.log(ship)
        if (
            (event['event'] === 'rank' ||
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
            event['PilotRank'] &&
            event['Ship']
        ) {
            const name = event['PilotName'];
            if (!Object.keys(ship).includes(name)) {
                const rank =
                    reversedRanks[
                        event['PilotRank'].toLowerCase().replace(' ', '')
                    ];

                ship[name] = {
                    rank: rank,
                    shipType: event['Ship'],
                };

                if (!Object.keys(shipType).includes(event['Ship'])) {
                    shipType[event['Ship']] = 0;
                }
                if (
                    !Object.keys(system[currentSystem].ships).includes(
                        event['Ship'],
                    )
                ) {
                    system[currentSystem].ships[event['Ship']] = 0;
                }
            }
        } else if (event['Rewards'] && event['PilotName']) {
            const name = event['PilotName'];
            let bounty: number = 0;
            if (event['event'] === 'Bounty') {
                bounty = event['Rewards'][0]['Reward'];
                totalBounties += bounty;
                system[currentSystem].bounty += bounty;
            }
            if (Object.keys(ship).includes(name)) {
                const rank = ship[name].rank;

                killRecord[currentRank][rank]++;
                system[currentSystem].kills++;
                system[currentSystem].ships[ship[name].shipType]++;
                shipType[ship[name].shipType]++;
                totalKills++;

                delete ship[name];
            }
        } else if (event['event'] === 'FSDJump' && event['StarSystem']) {
            currentSystem = event['StarSystem'];
            if (!Object.keys(system).includes(event['StarSystem'])) {
                system[event['StarSystem']] = {
                    kills: 0,
                    ships: {},
                    lastVisit: event['timestamp']!,
                    bounty: 0,
                };
            }
        }
    }
    console.log(system);
    const topSystems: TopSystems[] = Object.keys(system).map((systemName) => ({
        name: systemName,
        specs: system[systemName],
    }));
    topSystems.sort(function (a, b) {
        return b.specs.kills - a.specs.kills;
    });
    console.log(topSystems);
    const systemShips = Object.keys(topSystems[0].specs.ships).map((ship) => ({
        name: ship,
        kills: topSystems[0].specs.ships[ship],
    }));
    systemShips.sort(function (a, b) {
        return b.kills - a.kills;
    });
    console.log(systemShips);

    const lastVisit = new Date(topSystems[0].specs.lastVisit);
    const year = lastVisit.getFullYear();
    const month = lastVisit.getUTCMonth();
    const day = lastVisit.getDate();

    const topSystem = {
        name: topSystems[0].name,
        kills: topSystems[0].specs.kills,
        bounty: topSystems[0].specs.bounty,
        ship: systemShips[0],
        lastVisit: `${day}-${month}-${year + 1286}`,
    };

    let topShips = Object.keys(shipType).map((ship) => ({
        name: ship,
        kills: shipType[ship],
    }));
    topShips.sort(function (a, b) {
        return b.kills - a.kills;
    });

    return {
        killRecord: killRecord,
        topSystem: topSystem,
        topShips: topShips,
        totalBounties: totalBounties,
        totalKills: totalKills,
    };
}
