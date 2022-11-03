import React, { useState, useEffect, useRef } from 'react';
import logo from './722-7221067_360-compass-png-png-download-360-degree-compass.png';
import './App.css';

const App = () => {
  const compassRef = useRef<HTMLDivElement>(null);
  const [mouseX, setX] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [constraint, setConstraint] = useState<number>(20);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      setX(e.x);
    };
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, [setX]);

  useEffect(() => {
    const compassRect: DOMRect | undefined = compassRef.current?.getBoundingClientRect();
    const compassX = compassRect?.x !== undefined ? compassRect?.x : 0;
    const compassWidth = compassRect?.width !== undefined ? compassRect?.width : 0;
    setRotation((mouseX - compassX - (compassWidth / 2)) / constraint);
  }, [mouseX, constraint]);

  return (
    <div className="app">
      <div className="app-header">
        <div className='pip' />
        <div
          ref={compassRef}
          className="app-logo-container"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        >
          <img src={logo} className="app-logo" alt="logo" />
        </div>
      </div>
      <div className='sensitivity-container'>
        <p>Sensitivity: {constraint}</p>
      </div>
      <div className='range-container'>
        <input
          className='range'
          type="range"
          min={0.1}
          max={30}
          step={0.1}
          value={constraint}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setConstraint(e.target.valueAsNumber);
          }}
        />
      </div>
      <br />
      <button
        onClick={() => {
          setRotation(0);
        }}
      >
        SYNC
      </button>
      <p className='drag'>DRAG ME</p>
    </div>
  );
};

export default App;
