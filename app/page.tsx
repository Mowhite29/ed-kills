//import Image from 'next/image';
import Head from 'next/head';
import Main from './Components/Main';

export default function Home() {
    return (
        <>
            <Head>
                <meta name='application-name' content='PWA App' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta
                    name='apple-mobile-web-app-status-bar-style'
                    content='default'
                />
                <meta name='apple-mobile-web-app-title' content='PWA App' />
                <meta name='description' content='Best PWA App in the world' />
                <meta name='format-detection' content='telephone=no' />
                <meta name='mobile-web-app-capable' content='yes' />
                <meta
                    name='msapplication-config'
                    content='/icons/browserconfig.xml'
                />
                <meta name='msapplication-TileColor' content='#2B5797' />
                <meta name='msapplication-tap-highlight' content='no' />
                <meta name='theme-color' content='#000000' />
            </Head>
            <div className='font-sans min-h-screen bg-gray-900 text-slate-100 '>
                <main className='flex flex-col items-center sm:items-start gap-8'>
                    <Main />
                </main>
            </div>
        </>
    );
}
