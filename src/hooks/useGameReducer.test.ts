import {
  updatePlayerCards,
  checkGameOver,
  gameReducer,
  useGameReducer,
  GameState,
} from "./useGameReducer";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCardAPI } from "./useCardAPI";
import { Suit } from "@/types";

jest.mock("./useCardAPI", () => ({
  useCardAPI: jest.fn(),
}));

const cardGenerator = (value: string, suit: Suit) => ({
  value,
  suit,
  code: `${value}${suit.toUpperCase()}`,
  image: `https://example.com/${value}${suit.toUpperCase()}.png`,
  images: {
    svg: `https://example.com/${value}${suit.toUpperCase()}.svg`,
    png: `https://example.com/${value}${suit.toUpperCase()}.png`,
  },
});

describe("useGameReducer", () => {
  const mockFetchCards = jest.fn();
  const mockCardAPI = { fetchCards: mockFetchCards };

  beforeEach(() => {
    jest.resetAllMocks();
    (useCardAPI as jest.Mock).mockReturnValue(mockCardAPI);
    mockFetchCards.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updatePlayerCards", () => {
    it("should add a new card to player cards and update score", () => {
      const initialState = {
        playerCards: [cardGenerator("10", "HEARTS")],
        playerScore: 10,
        gameState: GameState.playing,
        houseCards: [],
        houseScore: 0,
        deckId: "test-deck-id",
      };
      const newCard = cardGenerator("5", "CLUBS");

      const result = updatePlayerCards(initialState, newCard);

      expect(result.playerCards).toHaveLength(2);
      expect(result.playerCards[1]).toEqual(newCard);
      expect(result.playerScore).toBe(15);
    });
  });

  describe("checkGameOver", () => {
    it("should set gameState to ended if player busts", () => {
      const state = {
        playerScore: 22,
        houseScore: 15,
        gameState: GameState.playing,
        playerCards: [],
        houseCards: [],
        deckId: "test-deck-id",
      };

      const result = checkGameOver(state);

      expect(result.gameState).toBe(GameState.ended);
    });

    it("should set gameState to ended if player score is 21", () => {
      const state = {
        playerScore: 21,
        houseScore: 15,
        gameState: GameState.playing,
        playerCards: [],
        houseCards: [],
        deckId: "test-deck-id",
      };

      const result = checkGameOver(state);

      expect(result.gameState).toBe(GameState.ended);
    });

    it("should not change gameState if game is not over", () => {
      const state = {
        playerScore: 18,
        houseScore: 15,
        gameState: GameState.playing,
        playerCards: [],
        houseCards: [],
        deckId: "test-deck-id",
      };

      const result = checkGameOver(state);

      expect(result.gameState).toBe(GameState.playing);
    });
  });

  describe("gameReducer", () => {
    it("should handle START_GAME action", () => {
      const initialState = {
        gameState: GameState.initial,
        playerCards: [],
        houseCards: [],
        playerScore: 0,
        houseScore: 0,
        deckId: null,
      };
      const action = {
        type: "START_GAME" as const,
        payload: {
          playerCards: [
            cardGenerator("10", "HEARTS"),
            cardGenerator("5", "CLUBS"),
          ],
          houseCards: [
            cardGenerator("8", "DIAMONDS"),
            cardGenerator("7", "SPADES"),
          ],
          deckId: "new-deck-id",
        },
      };

      const result = gameReducer(initialState, action);

      expect(result.gameState).toBe(GameState.playing);
      expect(result.playerCards).toEqual(action.payload.playerCards);
      expect(result.houseCards).toEqual(action.payload.houseCards);
      expect(result.playerScore).toBe(15);
      expect(result.houseScore).toBe(15);
      expect(result.deckId).toBe("new-deck-id");
    });

    it("should handle HIT action", () => {
      const initialState = {
        gameState: GameState.playing,
        playerCards: [cardGenerator("10", "HEARTS")],
        houseCards: [cardGenerator("8", "DIAMONDS")],
        playerScore: 10,
        houseScore: 8,
        deckId: "test-deck-id",
      };
      const action = {
        type: "HIT" as const,
        payload: cardGenerator("5", "CLUBS"),
      };

      const result = gameReducer(initialState, action);

      expect(result.playerCards).toHaveLength(2);
      expect(result.playerCards[1]).toEqual(action.payload);
      expect(result.playerScore).toBe(15);
      expect(result.gameState).toBe(GameState.playing);
    });

    it("should handle STAND action", () => {
      const initialState = {
        gameState: GameState.playing,
        playerCards: [cardGenerator("10", "HEARTS")],
        houseCards: [cardGenerator("8", "DIAMONDS")],
        playerScore: 10,
        houseScore: 8,
        deckId: "test-deck-id",
      };
      const action = { type: "STAND" as const };

      const result = gameReducer(initialState, action);

      expect(result.gameState).toBe(GameState.ended);
    });

    it("should handle END_GAME action", () => {
      const initialState = {
        gameState: GameState.playing,
        playerCards: [cardGenerator("10", "HEARTS")],
        houseCards: [cardGenerator("8", "DIAMONDS")],
        playerScore: 10,
        houseScore: 8,
        deckId: "test-deck-id",
      };
      const action = { type: "END_GAME" as const };

      const result = gameReducer(initialState, action);

      expect(result.gameState).toBe(GameState.ended);
    });
  });

  describe("useGameReducer", () => {
    it("should return state and actions", () => {
      const { result } = renderHook(() => useGameReducer(mockCardAPI));

      expect(result.current).toHaveProperty("state");
      expect(result.current).toHaveProperty("actions");
      expect(result.current.actions).toHaveProperty("startGame");
      expect(result.current.actions).toHaveProperty("hit");
      expect(result.current.actions).toHaveProperty("stand");
    });

    it("should call cardAPI.fetchCards when startGame is called", async () => {
      mockFetchCards.mockResolvedValue({
        cards: [
          { value: "10", suit: "hearts" },
          { value: "5", suit: "clubs" },
          { value: "8", suit: "diamonds" },
          { value: "7", suit: "spades" },
        ],
        deck_id: "test-deck-id",
      });

      const { result } = renderHook(() => useGameReducer(mockCardAPI));

      act(() => {
        result.current.actions.startGame();
      });

      await waitFor(() => {
        expect(mockFetchCards).toHaveBeenCalledWith(4);
      });
    });

    it("should call cardAPI.fetchCards when hit is called", async () => {
      mockFetchCards
        .mockResolvedValueOnce({
          cards: [
            { value: "10", suit: "hearts" },
            { value: "5", suit: "clubs" },
            { value: "8", suit: "diamonds" },
            { value: "7", suit: "spades" },
          ],
          deck_id: "test-deck-id",
        })
        .mockResolvedValueOnce({
          cards: [{ value: "6", suit: "hearts" }],
        });

      const { result } = renderHook(() => useGameReducer(mockCardAPI));

      await act(async () => {
        await result.current.actions.startGame();
      });

      await act(async () => {
        await result.current.actions.hit();
      });

      expect(mockFetchCards).toHaveBeenCalledTimes(2);
      expect(mockFetchCards).toHaveBeenLastCalledWith(1, "test-deck-id");
    });

    it("should throw error when hitting without initialized deck", async () => {
      const { result } = renderHook(() => useGameReducer(mockCardAPI));

      await act(async () => {
        await expect(result.current.actions.hit()).rejects.toThrow(
          "Deck not initialized"
        );
      });
    });
  });
});
