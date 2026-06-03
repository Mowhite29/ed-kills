'use client';
import { useEffect, useState } from 'react';

export default function Uploader() {
    const [file, setFile] = useState<FileList | null>(null);

    useEffect(() => {
        //console.log(file)
    }, [file]);

    const handler = (e) => {
        console.log(file);
        const newFile = {
            ...file,
            //...e.target.files
        };
        newFile[Object.keys(file!).length] = e.target.files[0];
        console.log(newFile);
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
