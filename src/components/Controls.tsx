"use client";

import { Button } from "./ui/button";
import { useGame } from "@/providers/GameProvider";

export default function Controls() {
  const {
    gameState,
    playerScore,
    houseScore,
    startGame,
    hit,
    stand,
    winner,
    remaining,
    deckId,
  } = useGame();

  return (
    <div className="flex flex-col space-y-4">
      {gameState === "initial" && (
        <Button variant="default" onClick={startGame}>
          Deal
        </Button>
      )}

      {gameState === "playing" && (
        <>
          <Button variant="secondary" onClick={hit}>
            Hit
          </Button>
          <Button variant="secondary" onClick={stand}>
            Stand
          </Button>
        </>
      )}

      {gameState === "ended" && (
        <Button variant="default" onClick={startGame}>
          New Game
        </Button>
      )}

      {/* Display scores and game result */}
      <div>
        <p>Your Score: {playerScore}</p>
        <p>House Score: {houseScore}</p>
        <p>Cards Remaining: {remaining}</p>
        {deckId && <p className="text-sm">Deck ID: {deckId}</p>}
        {gameState === "ended" && winner && (
          <p className="font-bold text-lg mt-2">
            {winner === "player"
              ? "You Win!"
              : winner === "house"
              ? "House Wins!"
              : "It's a Tie!"}
          </p>
        )}
      </div>
    </div>
  );
}
