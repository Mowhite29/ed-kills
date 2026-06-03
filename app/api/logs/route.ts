import { NextResponse } from 'next/server';
import * as fs from 'node:fs';
import path from 'path';

export async function GET() {
    const logDir = path.join(process.cwd(), 'logs');
    const fileNames = fs.readdirSync(logDir);
    console.log(fileNames);

    console.log({
        cwd: process.cwd(),
        logDir,
        exists: fs.existsSync(logDir),
    });

    return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
