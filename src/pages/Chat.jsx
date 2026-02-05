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
            setTimeout(() => fetchResponse(location.state.initialQuery), 500);
            // Clear state so it doesn't re-trigger on refresh if we don't want to
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender, id: Date.now() }]);
    };

    const handleSendMessage = (text) => {
        addMessage(text, 'user');
        fetchResponse(text);
    };

    const fetchResponse = async (userMessage) => {
        setIsStreaming(true);
        // Add a placeholder message for AI
        const aiMessageId = Date.now() + 1;
        setMessages(prev => [...prev, { text: "...", sender: 'ai', id: aiMessageId, isStreaming: true }]);

        try {
            const response = await fetch('http://localhost:8080/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'User-Agent': 'insomnia/12.3.0' // Browsers set User-Agent automatically, usually can't be overridden safely
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Assuming the API returns { message: "response text" } or similar. 
            // Check the actual response structure. 
            // If the user said "message": "내 이름은?" in the request, logic suggests the answer is in a field.
            // Let's assume 'answer' or 'message' or just the whole body if it's text.
            // Based on common practices, let's try to find the text field.
            // If the user provided CURL shows response, I would know. 
            // I'll assume 'answer' or 'response' or 'message'. 
            // Let's dump the whole JSON if unsure or pick a likely field.
            // For now, let's assume the response has a 'message' or 'answer' field.
            // If data is just a string, use it.

            const aiText = data.answer || data.message || JSON.stringify(data);

            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages.find(m => m.id === aiMessageId);
                if (lastMsg) {
                    lastMsg.text = aiText;
                    lastMsg.isStreaming = false;
                }
                return newMessages;
            });

        } catch (error) {
            console.error("Error fetching chat response:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages.find(m => m.id === aiMessageId);
                if (lastMsg) {
                    lastMsg.text = "죄송합니다. 서버와 통신 중 오류가 발생했습니다.";
                    lastMsg.isStreaming = false;
                }
                return newMessages;
            });
        } finally {
            setIsStreaming(false);
        }
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
