import { useEffect, useState } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // rotation ratios (motion)
  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  // rotation degrees (number positions)
  const secondsDegrees = secondsRatio * 360;
  const minutesDegrees = minutesRatio * 360;
  const hoursDegrees = hoursRatio * 360;

  // the numbers 1-12
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="">
    <div className="clock">
      {/* hands */}
      <div 
        className="hand hour" 
        style={{ transform: `rotate(${hoursDegrees}deg)` }}
        data-hour-hand 
      />
      <div 
        className="hand minute" 
        style={{ transform: `rotate(${minutesDegrees}deg)` }}
        data-minute-hand 
      />
      <div 
        className="hand second" 
        style={{ transform: `rotate(${secondsDegrees}deg)` }}
        data-second-hand 
      />

      {/* numbers */}
      {numbers.map((number) => (
        <div 
          key={number}
          className={`number number${number}`}
        >
          {number}
        </div>
      ))}
    </div>
    </div>
  );
};

export default AnalogClock;