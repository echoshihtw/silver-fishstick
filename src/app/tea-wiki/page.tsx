'use client';
import React, { memo, useState } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  const [facts, setFacts] = useState<string[]>([]);
  const tellFact = async () => {
    const response = await fetch('api/tea-wiki', {
      method: 'POST',
    });
    const { data } = await response.json();
    if (data) {
      setFacts([...facts, data] as string[]);
    }
  };
  const router = useRouter();
  return (
    <div className="w-full">
      <button onClick={() => router.push('/')}>&lt; home</button>
      <div className="grid place-items-center gap-5">
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
