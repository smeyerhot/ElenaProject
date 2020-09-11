import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  let [charIndex, setCharIndex] = useState(1);
  const [character, setCharacter] = useState({});

  const api = `https://cdn.rawgit.com/akabab/starwars-api/0.2.1/api/id/${charIndex}.json`;
  useEffect(() => {
    const loadChar = async () => {
      const result = await axios(api);
      console.log(result);
      setCharacter(result.data);
    };

    loadChar();
  }, [api]);

  let incCounter = () => {
    let counter = (charIndex += 1);
    setCharIndex(counter);
  };
  const { name, image, homeworld, species } = character;

  const characterHTML = (
    <div className="card">
      <div className="card-header">
        <h1 className="header-text">{name}</h1>
      </div>
      <div className="card-image">
        <img className="hero-image" src={image} alt="luke skywalker" />
      </div>
      <div className="card-footer">
        <p>{homeworld}</p>
        <p>{species}</p>
      </div>
    </div>
  );
  const buttonsHTML = (
    <div className="buttons-container">
      <button onClick={incCounter} value="next">
        Click Me
      </button>
    </div>
  );
  const myHTML = (
    <div className="md:flex">
    <div className="md:flex-shrink-0">
      <img className="rounded-lg md:w-56" src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=448&q=80" alt="Woman paying for a purchase"/>
    </div>
    <div className="mt-4 md:mt-0 md:ml-6">
      <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">Marketing</div>
      <a href="#" className="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline">Finding customers for your new business</a>
      <p className="mt-2 text-gray-600">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
    </div>
  </div>)
    
    ;
      


  return (
    <div className="App">
      {characterHTML}
          {buttonsHTML}
        {myHTML}
    </div>
  );
}
