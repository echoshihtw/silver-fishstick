'use client';
import React, { memo, useState } from 'react';

function Page() {
  const [facts, setFacts] = useState<string[]>([]);
  const tellFact = async () => {
    const response = await fetch('api/tea-wiki', {
      method: 'POST',
    });
    const { data } = await response.json();
    setFacts([...facts, data] as string[]);
  };
  return (
    <div className="w-full p-20">
      <div className="grid place-items-center border-amber-300 border-2 p-20 gap-5">
        <h1>🍄 Tea Wiki 🍄</h1>
        <button
          className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 px-3"
          onClick={tellFact}
        >
          Tell a fact about my favourite drink
        </button>
        <div>
          {facts.map((fact, i) => (
            <li key={i}>{fact}</li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Page);
