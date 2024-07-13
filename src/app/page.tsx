'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [theme, setTheme] = useState<string>();
  const [storyTitle, setStoryTitle] = useState<string>();
  const [storyBody, setStoryBody] = useState<string>();
  const handleChangeTheme = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTheme(event.target.value);
      setStoryTitle('');
    },
    [setTheme, setStoryTitle]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // call the LLM with the subject as the main prompt
    const response = await fetch('api', {
      method: 'POST',
      body: JSON.stringify({ theme }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { data } = await response.json();
    setStoryTitle(data['text']);
  };

  //! call this method when the start story button is pressed
  const handleStartStoryStream = async () => {
    //! reset the story body, call the backend
    setStoryBody('');

    // and display the response in the story body
    const response = await fetch('api', {
      method: 'POST',
      body: JSON.stringify({ theme, storyTitle }),
    });
    //the reader will act as a data communication "pipe"
    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    //keep the connection while we keep receiving new response chunks
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      const chunkValue = decoder.decode(value);
      setStoryBody((prev) => prev + chunkValue);
    }
  };
  const router = useRouter();
  return (
    <div className="w-full p-20">
      <div className="grid place-items-center border-amber-300 border-2 p-20 gap-5">
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
