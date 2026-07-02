'use client';
import { useEffect, useState } from 'react';

export default function Uploader() {
    const [file, setFile] = useState<FileList | null>(null);

    const handler = (e: { target: { files: File[] } }) => {
        const newFile: FileList = {
            ...file!,
        };
        newFile[Object.keys(file!).length] = e.target.files[0];
        setFile(newFile);
    };

    return (
        <form method='post'>
            <div className='flex flex-col'>
                <input
                    type='file'
                    id='fileInput'
                    name='fileInput'
                    accept='.log'
                    multiple
                    onChange={(e) => setFile(e.target.files)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
                <div className='flex flex-col'>
                    {file === null
                        ? 'No files selected'
                        : Object.keys(file!).map((item, index) => (
                              <span key={index}>{file![index]!.name}</span>
                          ))}
                </div>
            </div>
        </form>
    );
}
