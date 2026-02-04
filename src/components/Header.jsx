import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm">
            {/* Logo Area */}
            <div className="text-xl font-bold tracking-tighter select-none">
                <Link to="/" className="text-black dark:text-white logo flex items-center">
                    <img src="../public/t-logo.png" alt="Logo" />
                </Link>
            </div>

            {/* Navigation / Actions */}
            <nav className="flex items-center space-x-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-200">About</a>
                <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-200">Blog</a>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )}
                </button>

                {/* Sign In Button */}
                <button className="hidden md:block px-4 py-2 text-black dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-md border border-black/5 dark:border-white/5">
                    Sign In
                </button>
            </nav>
        </header>
    );
};

export default Header;
