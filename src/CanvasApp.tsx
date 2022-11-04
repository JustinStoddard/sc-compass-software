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

const CanvasApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [constraint, setConstraint] = useState<number>(15);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const resize = () => {
    window.ipcRenderer.send('resize');
  };

  const handleCompassEnter = () => {
    window.ipcRenderer.send('compass-enter');
  };

  const handleCompassLeave = () => {
    window.ipcRenderer.send('compass-leave');
  };

  const handleCanvasClick = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.requestPointerLock();
    }
  };

  const handleLockChangeAlert = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      if (document.pointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
      } else {
        console.log('The pointer lock status is now unlocked');
      }
    }
  };

  const handleMouseMove = (movement) => {
    console.log(movement);
    // if (canvasRef.current) {
    //   const canvas = canvasRef.current;
    //   let x = mousePosition.x + movement.x;
    //   let y = mousePosition.y + movement.y;

    //   if (x > canvas.clientWidth + 20) {
    //     x = 0;
    //   }
   
    //   if (y > canvas.clientHeight + 20) {
    //     y = 0;
    //   }
   
    //   if (x < -15) {
    //     x = canvas.clientWidth;
    //   }
   
    //   if (y < -15) {
    //     y = canvas.clientHeight;
    //   }

    //   console.log({ x, y });

    //   setMousePosition({ x, y });
    // }
  };

  const canvasDraw = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        context.fillStyle = '#F9F903';
        context.beginPath();
        context.arc(mousePosition.x, mousePosition.y, 20, 0, Math.PI * 2, true);
        context.fill();
      }
    }
  };

  useEffect(() => {
    canvasDraw();
  });

  useEffect(() => {
    document.addEventListener('pointerlockchange', handleLockChangeAlert, false);
    // window.ipcRenderer.send('init');
    // window.ipcRenderer.on('init', (event, args) => {
    //   setDimensions(args);
    // });
  }, []);

  useEffect(() => {
    const compassRect: DOMRect | undefined = compassRef.current?.getBoundingClientRect();
    const compassX = compassRect?.x !== undefined ? compassRect?.x : 0;
    const compassWidth = compassRect?.width !== undefined ? compassRect?.width : 0;
    setRotation((mousePosition.x - compassX - (compassWidth / 2)) / constraint);
  }, [mousePosition.x, constraint]);

  return (
    <div className="app">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={() => handleCanvasClick()}
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => handleMouseMove(e)}
      />
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

export default CanvasApp;