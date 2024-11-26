import React, { useState, useEffect } from 'react';

function KeystrokeCapture() {
  const [keystrokes, setKeystrokes] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keystroke = {
        key: event.key,
        event: 'press',
        time: Date.now(),
        holdDuration: 0, // Initialize hold duration
      };
      setKeystrokes([...keystrokes, keystroke]);
    };

    const handleKeyUp = (event) => {
      const lastKeystrokeIndex = keystrokes.length - 1;
      const lastKeystroke = keystrokes[lastKeystrokeIndex];

      if (lastKeystroke && lastKeystroke.key === event.key) {
        lastKeystroke.event = 'release';
        lastKeystroke.holdDuration = Date.now() - lastKeystroke.time;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keystrokes]);

  return (
    <div>
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <pre>{JSON.stringify(keystrokes, null, 2)}</pre>
    </div>
  );
}

export default KeystrokeCapture;