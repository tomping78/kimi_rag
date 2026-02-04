import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import InputBar from '../components/InputBar';

const Chat = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const bottomRef = useRef(null);
    const hasInitialized = useRef(false);

    // Initial load handling
    useEffect(() => {
        if (!hasInitialized.current && location.state?.initialQuery) {
            hasInitialized.current = true;
            addMessage(location.state.initialQuery, 'user');
            // Mock AI response for the initial query
            setTimeout(() => streamResponse(), 500);
            // Clear state so it doesn't re-trigger on refresh if we don't want to
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender, id: Date.now() }]);
    };

    const handleSendMessage = (text) => {
        addMessage(text, 'user');
        setTimeout(() => streamResponse(), 500);
    };

    const streamResponse = () => {
        setIsStreaming(true);
        const mockResponse = "This is a simulated AI response. In a real application, this would be connected to a backend retrieval system. I can answer questions about the documentation you've uploaded.";
        let currentText = "";
        let index = 0;

        // Add a placeholder message for AI
        setMessages(prev => [...prev, { text: "", sender: 'ai', id: Date.now() + 1, isStreaming: true }]);

        const interval = setInterval(() => {
            if (index < mockResponse.length) {
                currentText += mockResponse[index];
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.sender === 'ai' && lastMsg.isStreaming) {
                        lastMsg.text = currentText;
                    }
                    return newMessages;
                });
                index++;
                scrollToBottom();
            } else {
                clearInterval(interval);
                setIsStreaming(false);
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    lastMsg.isStreaming = false; // Done streaming
                    return newMessages;
                });
            }
        }, 30); // Typing speed
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen pt-20 pb-6 px-4 max-w-3xl mx-auto">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.sender === 'user'
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white'
                            : 'text-black dark:text-white'
                            }`}>
                            {msg.sender === 'ai' && (
                                <div className="font-bold text-sm mb-1 text-blue-600 dark:text-blue-400">KIMI</div>
                            )}
                            <div className="leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 align-middle bg-zinc-400 animate-pulse" />}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Welcome */}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <p className="text-zinc-400">Ask a question to start the conversation.</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Wrapper */}
            <div className="mt-4">
                <InputBar onSubmit={handleSendMessage} />
            </div>
        </div>
    );
};

export default Chat;
