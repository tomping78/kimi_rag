import React, { useState } from 'react';

const InputBar = ({ onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (!inputValue.trim()) return;
        if (onSubmit) {
            onSubmit(inputValue);
        }
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="bg-gradient-to-t to-transparent">
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 chat-area opacity-10 group-hover:opacity-50 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden chat-area">

                    {/* Input Field */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="w-full bg-transparent text-black dark:text-white px-6 py-4 md:py-5 outline-none placeholder-zinc-400 dark:placeholder-zinc-500 text-lg"
                    />

                    {/* Action Buttons */}
                    <div className="absolute right-5 flex items-center space-x-2">
                        {/* Voice Button */}
                        <button
                            className="p-2 text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                            title="Voice Input"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="6" x2="12" y2="18"></line>
                                <line x1="16" y1="10" x2="16" y2="14"></line>
                                <line x1="20" y1="12" x2="20" y2="12"></line>
                                <line x1="8" y1="10" x2="8" y2="14"></line>
                                <line x1="4" y1="12" x2="4" y2="12"></line>
                            </svg>
                        </button>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="p-2 text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="text-center mt-8 text-xs text-zinc-400 hidden md:block">
                T-covered can make mistakes. Verify important information.
            </div>
        </div>
    );
};

export default InputBar;
