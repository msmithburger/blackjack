import { useReducer, useCallback } from "react";
import { Card } from "@/types";
import { calculateScore, getCards, isGameOver } from "@/lib/gameLogic";
import { pipe } from "@/lib/fp";

export enum GameState {
  initial = "initial",
  playing = "playing",
  ended = "ended",
}

export type State = {
  gameState: GameState;
  playerCards: Card[];
  houseCards: Card[];
  playerScore: number;
  houseScore: number;
  deckId: string | null;
  remaining: number;
};

type Action =
  | {
      type: "START_GAME";
      payload: {
        playerCards: Card[];
        houseCards: Card[];
        deckId: string;
        remaining: number;
      };
    }
  | { type: "HIT"; payload: { card: Card; remaining: number } }
  | { type: "STAND" }
  | { type: "END_GAME" };

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
          remaining: action.payload.remaining,
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
        (s) => updatePlayerCards(s, action.payload.card),
        (s) => ({ ...s, remaining: action.payload.remaining }),
        checkGameOver
      );
    case "STAND":
    case "END_GAME":
      return { ...state, gameState: GameState.ended };
    default:
      return state;
  }
};

export function useGameReducer(
  initialState: State = {
    gameState: GameState.initial,
    playerCards: [],
    houseCards: [],
    playerScore: 0,
    houseScore: 0,
    deckId: null,
    remaining: 52,
  }
) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(async () => {
    const { cards, remaining, deckId } = await getCards(state, 4);

    dispatch({
      type: "START_GAME",
      payload: {
        playerCards: cards.slice(0, 2),
        houseCards: cards.slice(2, 4),
        deckId,
        remaining,
      },
    });
  }, [state]);

  const hit = useCallback(async () => {
    const { cards, remaining } = await getCards(state, 1);
    const [newCard] = cards;
    dispatch({ type: "HIT", payload: { card: newCard, remaining } });
  }, [state]);

  const stand = useCallback(() => dispatch({ type: "STAND" }), []);

  return { state, actions: { startGame, hit, stand } };
}
