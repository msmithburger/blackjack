import { useReducer, useCallback } from "react";
import { Card } from "@/types";
import { calculateScore, isGameOver } from "@/lib/gameLogic";
import { pipe } from "@/lib/fp";
import { useCardAPI } from "./useCardAPI";

export enum GameState {
  initial = "initial",
  playing = "playing",
  ended = "ended",
}

type State = {
  gameState: GameState;
  playerCards: Card[];
  houseCards: Card[];
  playerScore: number;
  houseScore: number;
  deckId: string | null;
};

type Action =
  | {
      type: "START_GAME";
      payload: { playerCards: Card[]; houseCards: Card[]; deckId: string };
    }
  | { type: "HIT"; payload: Card }
  | { type: "STAND" }
  | { type: "END_GAME" };

const initialState: State = {
  gameState: GameState.initial,
  playerCards: [],
  houseCards: [],
  playerScore: 0,
  houseScore: 0,
  deckId: null,
};

export const updatePlayerCards = (state: State, newCard: Card): State => ({
  ...state,
  playerCards: [...state.playerCards, newCard],
  playerScore: calculateScore([...state.playerCards, newCard]),
});

export const checkGameOver = (state: State): State => ({
  ...state,
  gameState: isGameOver(state.playerScore, state.houseScore)
    ? GameState.ended
    : state.gameState,
});

export const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_GAME":
      return pipe(
        state,
        (s) => ({ ...s, gameState: GameState.playing }),
        (s) => ({
          ...s,
          playerCards: action.payload.playerCards,
          houseCards: action.payload.houseCards,
          deckId: action.payload.deckId,
        }),
        (s) => ({
          ...s,
          playerScore: calculateScore(s.playerCards),
          houseScore: calculateScore(s.houseCards),
        })
      );
    case "HIT":
      return pipe(
        state,
        (s) => updatePlayerCards(s, action.payload),
        checkGameOver
      );
    case "STAND":
    case "END_GAME":
      return { ...state, gameState: GameState.ended };
    default:
      return state;
  }
};

// Use the return type of useCardAPI
export function useGameReducer(cardAPI: ReturnType<typeof useCardAPI>) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(async () => {
    const { cards, deck_id } = await cardAPI.fetchCards(4);
    dispatch({
      type: "START_GAME",
      payload: {
        playerCards: cards.slice(0, 2),
        houseCards: cards.slice(2, 4),
        deckId: deck_id,
      },
    });
  }, [cardAPI]);

  const hit = useCallback(async () => {
    if (!state.deckId) throw new Error("Deck not initialized");
    const { cards } = await cardAPI.fetchCards(1, state.deckId);
    const [newCard] = cards;
    dispatch({ type: "HIT", payload: newCard });
  }, [cardAPI, state.deckId]);

  const stand = useCallback(() => dispatch({ type: "STAND" }), []);

  return { state, actions: { startGame, hit, stand } };
}
