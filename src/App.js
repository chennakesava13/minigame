import React, { useState } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100');
  const [numberToGuess] = useState(Math.floor(Math.random() * 100) + 1);
  const [gameOver, setGameOver] = useState(false);

  const handleChange = (event) => {
    setGuess(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userGuess = parseInt(guess, 10);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100');
    } else {
      if (userGuess === numberToGuess) {
        setMessage(`Congratulations! You guessed the correct number (${numberToGuess}).`);
        setGameOver(true);
      } else if (userGuess < numberToGuess) {
        setMessage('Try a higher number.');
      } else {
        setMessage('Try a lower number.');
      }
      setGuess('');
    }
  };

  const restartGame = () => {
    setGuess('');
    setMessage('Guess a number between 1 and 100');
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      {!gameOver ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={guess}
            onChange={handleChange}
            placeholder="Enter your guess"
          />
          <button type="submit">Guess</button>
        </form>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
