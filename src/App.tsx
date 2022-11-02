import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      setX(e.x);
      setY(e.y)
    };
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, [setX, setY]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo-container">
          <p className="App-North">N</p>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p>x: {x} - y: {y}</p>
      </header>
    </div>
  );
};

export default App;
