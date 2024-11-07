import React, { useState } from 'react';

const AIComponent = () => {
    const [generatedText, setGeneratedText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleButtonClick = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/user/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setGeneratedText(data.text);
            setPrompt('');
            setLoading(false); // assuming data is the generated text
        } catch (error) {
            setLoading(false);
            console.error('Error generating content:', error);
            setGeneratedText('Error generating content');
        }
    };

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-xl font-semibold text-blue-600">
                    <span className="text-3xl font-bold">Loading...</span>
                    <div className="mt-2">Please wait while we generate content.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
            <h1 className="text-black font-bold text-3xl md:text-4xl mb-6 text-center">AI Generative Content</h1>

            <div className="flex flex-col md:flex-row justify-between gap-4 items-center w-full max-w-4xl">
                {/* Prompt Input */}
                <textarea
                    className="w-full md:w-3/4 p-4 h-20 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={handlePromptChange}
                />
                {/* Generate Button */}
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-auto mt-4 md:mt-0"
                    onClick={handleButtonClick}
                >
                    Generate
                </button>
            </div>

            {/* Generated Text Section */}
            <div className="mt-8 w-full max-w-4xl h-3/4 border-2 border-gray-300 bg-white rounded-xl p-6 text-black text-xl shadow-lg overflow-y-auto">
                {generatedText ? (
                    <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedText }} />
                ) : (
                    <p className="text-gray-500">Your generated content will appear here...</p>
                )}
            </div>
        </div>
    );
};

export default AIComponent;
