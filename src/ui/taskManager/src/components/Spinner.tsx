import { useState, useEffect } from 'react';
import { Color, Size } from '../types';

// A customizable spinner component
function Spinner(props: { 
  size : Size, 
  color : Color, 
  text : string
}) {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const animationSpeed = 1000;
    const timer = setInterval(() => {
      setRotation(prev => (prev + 30) % 360);
    }, animationSpeed / 12);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex items-center justify-center flex-col">
      <div 
        className={`rounded-full border-t-transparent ${props.size || Size.md} ${props.color || Color.blue} border`}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      {props.text && <p className="mt-2 text-sm text-gray-600">{props.text}</p>}
    </div>
  );
};

export default Spinner;