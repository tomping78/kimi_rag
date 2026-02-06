import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import InputBar from '../components/InputBar';
import Tooltip from '../components/Tooltip';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Chat = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const bottomRef = useRef(null);
    const hasInitialized = useRef(false);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

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
            console.log("API Response:", data); // Debug log to check structure

            // User requested to only show the "answer" field.
            // Based on debugging, the structure is data.result.answer
            let aiText = "";
            if (data.result && data.result.answer) {
                aiText = data.result.answer;
            } else if (data.answer) {
                aiText = data.answer;
            } else if (data.message) {
                aiText = data.message;
            } else {
                console.warn("Field 'answer' not found in response.", data);
                aiText = "죄송합니다. 답변을 불러올 수 없습니다.";
            }

            // Start typing simulation instead of setting text immediately
            simulateTyping(aiText, aiMessageId);

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
            setIsStreaming(false);
        }
    };

    const simulateTyping = (fullText, messageId) => {
        let index = 0;
        let currentText = "";

        // Initial clear of the "..." placeholder
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages.find(m => m.id === messageId);
            if (lastMsg) {
                lastMsg.text = "";
            }
            return newMessages;
        });

        const interval = setInterval(() => {
            if (index < fullText.length) {
                currentText += fullText[index];
                setMessages(prev => {
                    const newMessages = [...prev];
                    const targetMsg = newMessages.find(m => m.id === messageId);
                    if (targetMsg) {
                        targetMsg.text = currentText;
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
                    const targetMsg = newMessages.find(m => m.id === messageId);
                    if (targetMsg) {
                        targetMsg.isStreaming = false;
                    }
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
            <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl px-5 py-3 ${msg.sender === 'user'
                            ? 'max-w-[80%] bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white'
                            : 'w-full text-black dark:text-white'
                            }`}>
                            {msg.sender === 'ai' && (
                                <div className="font-bold text-sm mb-1 text-blue-600 dark:text-blue-400 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        KIMI
                                        {msg.text === "..." && msg.isStreaming && (
                                            <svg className="animate-spin h-3 w-3 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                    </div>
                                    {!msg.isStreaming && (
                                        <Tooltip text="답변 복사">
                                            <button
                                                onClick={() => handleCopy(msg.text, msg.id)}
                                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1.5 rounded"
                                            >
                                                {copiedId === msg.id ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </Tooltip>
                                    )}
                                </div>
                            )}
                            <div className="leading-relaxed">
                                <MarkdownRenderer content={msg.text} isStreaming={msg.isStreaming} />
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

            <div className="mt-4">
                <InputBar onSubmit={handleSendMessage} isLoading={isStreaming} />
            </div>
        </div>
    );
};

export default Chat;
