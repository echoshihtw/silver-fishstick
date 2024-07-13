'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="grid gap-5">
        LangChain exercises:
        <button
          className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 w-full"
          onClick={() => router.push('/story-teller')}
        >
          Story Teller
        </button>
        <button
          className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 w-full"
          onClick={() => router.push('/tea-wiki')}
        >
          Tea Wiki
        </button>
        <button
          className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 w-full"
          onClick={() => router.push('/trivia')}
        >
          Trivia
        </button>
      </div>
    </div>
  );
}
