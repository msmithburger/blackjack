"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type GameState = "initial" | "playing" | "ended";

interface GameContextType {
  gameState: GameState;
  playerScore: number;
  houseScore: number;
  startGame: () => void;
  hit: () => void;
  stand: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("initial");
  const [playerScore, setPlayerScore] = useState(0);
  const [houseScore, setHouseScore] = useState(0);

  const startGame = () => {
    setGameState("playing");
    setPlayerScore(0);
    setHouseScore(0);
  };

  const hit = () => {
    setPlayerScore((prevScore) => prevScore + 5);
    if (playerScore > 21) {
      endGame();
    }
  };

  const stand = () => {
    endGame();
  };

  const endGame = () => {
    setGameState("ended");
    // TODO: Determine winner and display result
  };

  const value = {
    gameState,
    playerScore,
    houseScore,
    startGame,
    hit,
    stand,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
