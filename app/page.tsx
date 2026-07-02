//import Image from 'next/image';
import Head from 'next/head';
import Main from './Components/Main';

export default function Home() {
    return (
        <>
            <Head>
                <meta charSet='UTF-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />

                <title>Combat Telemetry | Elite Dangerous</title>

                <meta
                    name='description'
                    content='Combat Telemetry for Elite Dangerous is a web application that parses Elite Dangerous journal files to analyse combat history, bounties, kill statistics and system activity.'
                />

                <meta
                    name='keywords'
                    content='Elite Dangerous, journal parser, combat telemetry, kill tracker, bounty tracker, React, JavaScript'
                />

                <meta name='author' content='Your Name' />
                <meta name='theme-color' content='#020617' />

                <link rel='icon' href='/favicon.ico' />

                <meta
                    property='og:title'
                    content='Combat Telemetry | Elite Dangerous'
                />
                <meta
                    property='og:description'
                    content='Analyse Elite Dangerous journal files and visualise combat statistics with a futuristic HUD interface.'
                />
                <meta property='og:type' content='website' />
            </Head>
            <div className='font-sans min-h-screen bg-gray-900 text-slate-100 '>
                <main className='flex flex-col items-center sm:items-start gap-8'>
                    <Main />
                </main>
            </div>
        </>
    );
}
