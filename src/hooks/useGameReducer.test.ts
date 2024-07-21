import { renderHook, act } from "@testing-library/react";
import { useGameReducer, GameState } from "./useGameReducer";
import { getCards } from "@/lib/gameLogic";
import { cardGenerator } from "@/lib/testUtils";

// Mock the getCards function
jest.mock("@/lib/gameLogic", () => ({
  getCards: jest.fn(),
  calculateScore: jest.fn(),
  isGameOver: jest.fn(),
}));

const playingState = {
  gameState: GameState.playing,
  playerCards: [cardGenerator("10", "HEARTS"), cardGenerator("5", "CLUBS")],
  houseCards: [cardGenerator("8", "DIAMONDS"), cardGenerator("7", "SPADES")],
  playerScore: 15,
  houseScore: 15,
  deckId: "test-deck-id",
  remaining: 48,
};

describe("useGameReducer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initial state", () => {
    const { result } = renderHook(() => useGameReducer());
    expect(result.current.state).toEqual({
      gameState: GameState.initial,
      playerCards: [],
      houseCards: [],
      playerScore: 0,
      houseScore: 0,
      deckId: null,
      remaining: 52,
    });
  });

  test("startGame action", async () => {
    (getCards as jest.Mock).mockResolvedValue({
      cards: [...playingState.playerCards, ...playingState.houseCards],
      remaining: playingState.remaining,
      deckId: playingState.deckId,
    });

    const { result } = renderHook(() => useGameReducer());

    await act(async () => {
      await result.current.actions.startGame();
    });

    expect(result.current.state).toEqual(
      expect.objectContaining({
        gameState: GameState.playing,
        playerCards: playingState.playerCards,
        houseCards: playingState.houseCards,
        remaining: playingState.remaining,
      })
    );
  });

  test("hit action", async () => {
    const newCard = cardGenerator("7", "HEARTS");
    (getCards as jest.Mock).mockResolvedValue({
      cards: [newCard],
      remaining: 47,
      deckId: "test-deck-id",
    });

    const { result } = renderHook(() => useGameReducer(playingState));

    await act(async () => {
      await result.current.actions.hit();
    });

    expect(result.current.state).toEqual(
      expect.objectContaining({
        gameState: GameState.playing,
        playerCards: [...playingState.playerCards, newCard],
      })
    );
  });

  test("stand action", () => {
    const { result } = renderHook(() => useGameReducer(playingState));

    act(() => {
      result.current.actions.stand();
    });

    expect(result.current.state.gameState).toBe(GameState.ended);
  });
});
