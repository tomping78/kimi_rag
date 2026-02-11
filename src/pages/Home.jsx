import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hologram from '../components/Hologram';
import InputBar from '../components/InputBar';

const Home = () => {
    const navigate = useNavigate();

    const handleSearch = (query) => {
        // Navigate to chat page with the query
        navigate('/chat', { state: { initialQuery: query } });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 pt-20 pb-10">
            {/* Hologram Section */}
            <div className="mb-8 p-4">
                <Hologram />
            </div>

            <div className="text-center mb-12">
                <h1 className="text-black dark:text-white select-none main-title">
                    <span className='font-bold text-black dark:text-white'>KIMI</span> RAG SYSTEM
                </h1>
                <p className="sub-title text-zinc-500 dark:text-zinc-400">
                    Retrieval Augmented Generation for T-Covered
                </p>
            </div>

            {/* Input Bar */}
            <div className="w-full max-w-3xl relative z-20">
                <InputBar onSubmit={handleSearch} />
            </div>
        </div>
    );
};

export default Home;
