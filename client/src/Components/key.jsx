import React, { useEffect, useState } from 'react';

const KeyStrokeTracker = ({ onKeystrokeUpdate }) => {
  const [keystrokes, setKeystrokes] = useState([]);
  const [keyHoldTimes, setKeyHoldTimes] = useState({});
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!event.key) return; // Prevent errors when key is undefined

      const time = Date.now();
      if (!startTime) setStartTime(time);

      const newKeystroke = {
        key: event.key.toUpperCase(),
        event: 'press',
        time: time - startTime,
        hold_duration: null,
      };

      setKeystrokes((prev) => {
        const updatedKeystrokes = [...prev, newKeystroke];
        onKeystrokeUpdate(updatedKeystrokes);
        return updatedKeystrokes;
      });
      setKeyHoldTimes((prev) => ({ ...prev, [event.key]: time }));
    };

    const handleKeyRelease = (event) => {
      if (!event.key) return; // Prevent errors when key is undefined

      const time = Date.now();
      const holdTime = keyHoldTimes[event.key] ? time - keyHoldTimes[event.key] : 0;

      const newKeystroke = {
        key: event.key.toUpperCase(),
        event: 'release',
        time: time - startTime,
        hold_duration: holdTime,
      };

      setKeystrokes((prev) => {
        const updatedKeystrokes = [...prev, newKeystroke];
        onKeystrokeUpdate(updatedKeystrokes);
        return updatedKeystrokes;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [keyHoldTimes, startTime, onKeystrokeUpdate]);

  return (
    <div style={{ display: 'none' }}>KeyStroke Tracker Active</div>
  );
};

export default KeyStrokeTracker;
