import React, { useState, useEffect } from 'react';

const RightSidebar: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [embedUrl, setEmbedUrl] = useState('');

    const videoIds = [
        '69S3zHJ5274', // Sharda University - Study in India
        'rroph5Sfurg'  // Sharda University Greater Noida Campus
    ];

    const playlist = videoIds.join(',');

    useEffect(() => {
        // We must construct the URL in a useEffect hook to safely access `window.location.origin`.
        // This ensures the code only runs on the client-side where `window` is available.
        if (typeof window !== 'undefined') {
            const origin = window.location.origin;
            // Adding the `origin` parameter is crucial for resolving embed errors in sandboxed environments.
            setEmbedUrl(`https://www.youtube.com/embed/${videoIds[0]}?playlist=${playlist}&loop=1&autoplay=1&mute=1&controls=1&origin=${origin}`);
        }
    }, [playlist]);
    
    return (
        <div className="bg-gray-100 rounded-2xl p-4 h-full flex flex-col">
            <div className="flex justify-center mb-4 flex-shrink-0">
                <button className="bg-white border-2 border-orange-400 text-gray-700 font-semibold py-2 px-6 rounded-lg">
                    @ Uni face
                </button>
            </div>
            <div 
                className="flex-grow relative rounded-lg overflow-hidden shadow-inner bg-black bg-cover bg-center flex justify-center items-center cursor-pointer group"
                style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoIds[0]}/maxresdefault.jpg)` }}
                onClick={() => !isPlaying && setIsPlaying(true)}
            >
                {isPlaying && embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title="Sharda University Advertisement"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                ) : (
                    <div
                        className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300"
                        aria-label="Play video"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;