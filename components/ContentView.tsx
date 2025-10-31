import React from 'react';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@StudyAtShardaBD';

const videos = [
    {
        id: 'G-xzRDoeymw',
        title: 'Sharda University Campus Tour 2024 | Full Campus Video',
    },
    {
        id: 'odtOcRjV_5k',
        title: 'Study in India from Bangladesh || Sharda University in one minute',
    },
    {
        id: 'ChUC-BueRCg',
        title: 'Bangladeshi Students Celebration at Sharda University | Pohela Boishakh & Eid Reunion',
    },
    {
        id: 'gZB_OlkBljM',
        title: 'Why should Bangladeshi students study at Sharda University?',
    },
    {
        id: 'rroph5Sfurg',
        title: 'Student Experience at Sharda University',
    },
    {
        id: 'W4uKZAxZpDw',
        title: 'Campus Life at Sharda University',
    },
    {
        id: 'iElt3S0kJH0',
        title: 'Academic Programs at Sharda University',
    },
    {
        id: 'nx1iUEocDpk',
        title: 'International Student Guide',
    },
];

const ContentView: React.FC = () => {
    const mainVideoId = 'G-xzRDoeymw';

    return (
        <div className="col-span-1 md:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">Our YouTube Channel</h2>
                <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 md:mt-0 bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Visit @StudyAtShardaBD
                </a>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Featured Video</h3>
                <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <iframe
                        src={`https://www.youtube.com/embed/${mainVideoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">More Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <a
                            key={video.id}
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200"
                        >
                            <div className="relative">
                                <img
                                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-sm text-gray-800 group-hover:text-red-600 transition-colors h-10 overflow-hidden">{video.title}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentView;
