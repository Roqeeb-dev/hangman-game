import { useState, useEffect } from "react";
import languages from "./languages";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import ReactConfetti from "react-confetti";

export default function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guess, setGuess] = useState([]);

  const isGameWon = currentWord.split("").every((letter) => {
    return guess.includes(letter);
  });
  const wrongGuessCount = guess.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guess[guess.length - 1];
  const isLastGuessIncorrect = !currentWord.includes(lastGuessedLetter);

  function resetGame() {
    setCurrentWord(getRandomWord());
    setGuess([]);
  }

  function saveGuess(alphabet) {
    setGuess((prevGuess) => {
      return prevGuess.includes(alphabet)
        ? prevGuess
        : [...prevGuess, alphabet];
    });
  }
  const wordArray = currentWord.split("");
  const wordSpan = wordArray.map((letter, index) => {
    const letterClassName = clsx(
      isGameLost && !guess.includes(letter) && "missed-letters"
    );
    return (
      <span key={index} className={letterClassName}>
        {guess.includes(letter) || (isGameOver && isGameLost)
          ? letter.toUpperCase()
          : ""}
      </span>
    );
  });

  const languageList = languages.map((lang, index) => {
    return (
      <span
        key={lang.name}
        className={index < wrongGuessCount ? "lost" : "language-btn"}
        style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      >
        {lang.name}
      </span>
    );
  });

  const alphabets = "abcdefghijklmnopqrstuvwxyz";

  const keyboard = alphabets.split("").map((alphabet) => {
    const isGuessed = guess.includes(alphabet);
    const isCorrect = isGuessed && currentWord.includes(alphabet);
    const isWrong = isGuessed && !currentWord.includes(alphabet);

    const classname = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={classname}
        onClick={() => {
          {
            !isGameOver && saveGuess(alphabet);
          }
        }}
        key={alphabet}
      >
        {alphabet.toUpperCase()}
      </button>
    );
  });

  return (
    <main>
      {isGameWon && <ReactConfetti />}
      <header>
        <p className="title">Assembly: Endgame</p>
        <p className="instructions">
          Guess the word in under 8 attempts to keep the world safe from
          assembly
        </p>
      </header>

      <section
        className="status-section"
        style={{
          backgroundColor: isGameWon ? "green" : isGameLost ? "red" : "",
        }}
      >
        <h2>
          {isGameOver
            ? isGameWon
              ? "You won! 👏"
              : isGameLost
              ? "You lost ☠️"
              : ""
            : lastGuessedLetter && isLastGuessIncorrect
            ? getFarewellText(languages[wrongGuessCount - 1].name)
            : null}
        </h2>
        <p>
          {isGameOver
            ? isGameWon
              ? "Well done!"
              : isGameLost
              ? "You better start learning assembly"
              : ""
            : null}
        </p>
      </section>

      <section className="language-list">{languageList}</section>
      <section className="word-section">{wordSpan}</section>
      <section className="keyboard">{keyboard}</section>

      {isGameOver && (
        <button onClick={resetGame} className="new-game-btn">
          New Game
        </button>
      )}
    </main>
  );
}
