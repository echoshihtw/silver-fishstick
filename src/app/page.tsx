'use client';

import React, { useState } from 'react';

export default function Home() {
  const [storyTitle, setStoryTitle] = useState<string>();
  const [storyBody, setStoryBody] = useState<string>();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const subject = form.value;
    // call the LLM with the subject as the main prompt
    const response = await fetch('api', {
      method: 'POST',
      body: JSON.stringify({ subject }),
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
// and display the response in the story body
    setStoryBody('');
    const response = await fetch('api', {
      method: 'POST',
      body: JSON.stringify({ storyTitle }),
    });
    const { data } = await response.json();
    console.log('response',response)
    setStoryBody(data);
  };

  return (
    <div className="w-full p-20">
      <div className="grid place-items-center border-amber-300 border-2 p-20 gap-5">
        <h1> The Story Maker</h1>
        <em>This app uses a GPT Model to generate a story for kids.</em>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="subject">Main subject of the story:</label>
            {/*<input name="subject" placeholder="subject..." />*/}
            <select name="subject">
              <option value="cats">Shrooms</option>
              <option value="unicorns">Unicorns</option>
              <option value="elfs">Fairies</option>
            </select>
          </div>
          <button className=" border-2 border-fuchsia-900 bg-fuchsia-500/20">Ask AI Model</button>
        </form>
        {storyTitle &&
          <button onClick={handleStartStoryStream}
                  className="border-2 border-pink-300 px-3 py-2 h-fit text-xl min-h-[28px]">
            Tell me the story of {storyTitle}
          </button>
        }
        {storyBody && storyBody}
      </div>
    </div>
  );
}
