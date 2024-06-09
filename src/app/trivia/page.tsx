'use client';
import React, { useState } from 'react';

function Page() {
  const [question, setQuestion] = useState<string>();
  const handleGetQuestion = async () => {
    const response = await fetch('api/trivia', {
      method: 'GET',
    });
    setQuestion((await response.json()).question);
  };
  return (
    <div className="w-full p-20">
      <div className="grid place-items-center border-amber-300 border-2 p-20 gap-5">
        <h1>🍄The Psychedelic Trivia 🍄</h1>
        <button
          className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 px-3"
          onClick={handleGetQuestion}>Ask me a question
        </button>
        <div>
          <h2>{question}</h2>
        </div>
      </div>
    </div>
  );
}

export default Page;