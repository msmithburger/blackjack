"use client";

import { Card } from "@/types";
import { createContext, useContext, ReactNode } from "react";
import { determineWinner } from "@/lib/gameLogic";
import { useCardAPI } from "@/hooks/useCardAPI";
import { useGameReducer } from "@/hooks/useGameReducer";

type GameState = "initial" | "playing" | "ended";

type GameContextType = {
  gameState: GameState;
  playerCards: Card[];
  houseCards: Card[];
  playerScore: number;
  houseScore: number;
  startGame: () => Promise<void>;
  hit: () => Promise<void>;
  stand: () => void;
  winner: "player" | "house" | "tie" | null;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const cardAPI = useCardAPI();
  const { state, actions } = useGameReducer(cardAPI);

  const value = {
    ...state,
    startGame: actions.startGame,
    hit: actions.hit,
    stand: actions.stand,
    winner:
      state.gameState === "ended"
        ? determineWinner(state.playerScore, state.houseScore)
        : null,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
