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
    const response = await fetch('api/story-teller', {
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
    const response = await fetch('api/story-teller', {
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
    <div className="w-full">
      <button onClick={() => router.push('/')}>&lt; home</button>
      <div className="grid place-items-center gap-5">
        <h1>✨ The Story Maker ✨️</h1>
        <em>This app uses a GPT Model to generate a story for kids.</em>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div>
            <label htmlFor="subject">Main subject of the story:</label>
            <select
              name="subject"
              onChange={handleChangeTheme}
            >
              <option value="shrooms">Shrooms</option>
              <option value="unicorns">Unicorns</option>
              <option value="faries">Fairies</option>
            </select>
          </div>
          <button className="border-2 border-fuchsia-900 bg-fuchsia-500/20 py-2 w-full">
            Ask AI Model
          </button>
        </form>
        {storyTitle && (
          <button
            onClick={handleStartStoryStream}
            className="border-2 border-pink-300 px-3 py-2 h-fit text-xl min-h-[28px]"
          >
            Tell me the story of {storyTitle}
          </button>
        )}
        {storyBody && (
          <>
            <div>
              <span>{storyBody}</span>
              <span className="animate-[typing_0.7s_step-end_infinite] inline ml-2 w-2 h-2 rounded-xl border-[2px] border-pink-300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
