import React, { useState, useEffect, useRef } from 'react';
import { IpcRenderer } from 'electron';
import compass from './722-7221067_360-compass-png-png-download-360-degree-compass.png';
import drag from './581820-200.png';
import './App.css';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

const App = () => {
  const compassRef = useRef<HTMLDivElement>(null);
  const [mouseX, setX] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [constraint, setConstraint] = useState<number>(15);

  const resize = () => {
    window.ipcRenderer.send('resize');
  };

  const handleCompassEnter = () => {
    window.ipcRenderer.send('compass-enter');
  };

  const handleCompassLeave = () => {
    window.ipcRenderer.send('compass-leave');
  };

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
      <div
        className='pip-container'
        onMouseEnter={() => handleCompassEnter()}
        onMouseLeave={() => handleCompassLeave()}
      >
        <img src={drag} className='drag' alt='drag' />
        <div className='pip' />
        <div className='range-container'>
          <input
            className='range'
            type="number"
            value={constraint}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConstraint(e.target.valueAsNumber);
            }}
          />
          <button onClick={() => setRotation(0)}>SYNC</button>
          <button onClick={() => resize()}>RE-SIZE</button>
        </div>
      </div>
      <div className="app-header">
        <div
          ref={compassRef}
          className="app-logo-container"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        >
          <img src={compass} className="app-logo" alt="compass" />
        </div>
      </div>
    </div>
  );
};

export default App;
