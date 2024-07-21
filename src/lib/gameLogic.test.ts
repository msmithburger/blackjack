import { Card } from "@/types";
import * as gameLogic from "./gameLogic";
import { cardGenerator } from "./testUtils";
import { GameState } from "@/hooks/useGameReducer";
import { fetchCards, returnCardsToDeck, shuffleDeck } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  fetchCards: jest.fn(),
  returnCardsToDeck: jest.fn(),
  shuffleDeck: jest.fn(),
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

describe("gameLogic", () => {
  const mockFetchCards = fetchCards as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("calculateScore", () => {
    it("calculates score correctly for non-face cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "7" } as Card,
        { suit: "SPADES", value: "4" } as Card,
      ];
      expect(gameLogic.calculateScore(cards)).toBe(11);
    });

    it("calculates score correctly for face cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "KING" } as Card,
        { suit: "SPADES", value: "QUEEN" } as Card,
      ];
      expect(gameLogic.calculateScore(cards)).toBe(20);
    });

    it("handles Aces correctly", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "7" } as Card,
      ];
      expect(gameLogic.calculateScore(cards)).toBe(18);
    });

    it("adjusts Aces when score is over 21", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "ACE" } as Card,
        { suit: "DIAMONDS", value: "KING" } as Card,
      ];
      expect(gameLogic.calculateScore(cards)).toBe(12);
    });
  });

  describe("isGameOver", () => {
    it("returns true when player score is 21 or more", () => {
      expect(gameLogic.isGameOver(21, 15)).toBe(true);
      expect(gameLogic.isGameOver(22, 15)).toBe(true);
    });

    it("returns true when house score is 21 or more", () => {
      expect(gameLogic.isGameOver(15, 21)).toBe(true);
      expect(gameLogic.isGameOver(15, 22)).toBe(true);
    });

    it("returns false when both scores are below 21", () => {
      expect(gameLogic.isGameOver(20, 20)).toBe(false);
    });
  });

  describe("determineWinner", () => {
    it("returns 'house' when player busts", () => {
      expect(gameLogic.determineWinner(22, 20)).toBe("house");
    });

    it("returns 'player' when house busts", () => {
      expect(gameLogic.determineWinner(20, 22)).toBe("player");
    });

    it("returns 'tie' when scores are equal", () => {
      expect(gameLogic.determineWinner(20, 20)).toBe("tie");
    });

    it("returns 'player' when player score is higher", () => {
      expect(gameLogic.determineWinner(20, 18)).toBe("player");
    });

    it("returns 'house' when house score is higher", () => {
      expect(gameLogic.determineWinner(18, 20)).toBe("house");
    });
  });

  describe("isBust", () => {
    it("returns true when score is over 21", () => {
      expect(gameLogic.isBust(22)).toBe(true);
    });

    it("returns false when score is 21 or less", () => {
      expect(gameLogic.isBust(21)).toBe(false);
      expect(gameLogic.isBust(20)).toBe(false);
    });
  });

  describe("isBlackjack", () => {
    it("returns true for a blackjack hand", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "KING" } as Card,
      ];
      expect(gameLogic.isBlackjack(cards)).toBe(true);
    });

    it("returns false for a non-blackjack hand", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "10" } as Card,
        { suit: "SPADES", value: "KING" } as Card,
      ];
      expect(gameLogic.isBlackjack(cards)).toBe(false);
    });

    it("returns false for a 21-point hand with more than 2 cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "7" } as Card,
        { suit: "SPADES", value: "7" } as Card,
        { suit: "DIAMONDS", value: "7" } as Card,
      ];
      expect(gameLogic.isBlackjack(cards)).toBe(false);
    });
  });

  describe("createDiscardPileFromHands", () => {
    it("creates correct discard pile from player and house cards", () => {
      const playerCards: Card[] = [
        { suit: "HEARTS", value: "ACE", code: "AH" } as Card,
        { suit: "SPADES", value: "KING", code: "KS" } as Card,
      ];
      const houseCards: Card[] = [
        { suit: "DIAMONDS", value: "QUEEN", code: "QD" } as Card,
        { suit: "CLUBS", value: "10", code: "0C" } as Card,
      ];
      const discardPile = gameLogic.createDiscardPileFromHands(
        playerCards,
        houseCards
      );
      expect(discardPile.length).toBe(48);
      expect(discardPile).not.toContain("AH");
      expect(discardPile).not.toContain("KS");
      expect(discardPile).not.toContain("QD");
      expect(discardPile).not.toContain("0C");
    });
  });

  describe("getCards", () => {
    it("calls handleExistingDeck when deckId exists", async () => {
      const mockHandleExistingDeck = jest.fn().mockResolvedValueOnce({});

      jest
        .spyOn(gameLogic, "handleExistingDeck")
        .mockImplementationOnce(mockHandleExistingDeck);

      await gameLogic.getCards(playingState, 4);
      expect(mockHandleExistingDeck).toHaveBeenCalledWith(playingState, 4);
    });

    it("calls createNewDeck when deckId doesn't exist", async () => {
      const mockCreateNewDeck = jest.fn().mockResolvedValueOnce({});
      jest
        .spyOn(gameLogic, "createNewDeck")
        .mockImplementationOnce(mockCreateNewDeck);

      await gameLogic.getCards({ ...playingState, deckId: null }, 4);
      expect(mockCreateNewDeck).toHaveBeenCalled();
    });
  });

  describe("handleExistingDeck", () => {
    it("throws error when deckId is missing", async () => {
      await expect(
        gameLogic.handleExistingDeck({ ...playingState, deckId: null }, 4)
      ).rejects.toThrow("Deck ID is required");
    });

    it("calls handleInsufficientCards when remaining < 4", async () => {
      const mockHandleInsufficientCards = jest.fn().mockResolvedValueOnce({});
      jest
        .spyOn(gameLogic, "handleInsufficientCards")
        .mockImplementationOnce(mockHandleInsufficientCards);

      await gameLogic.handleExistingDeck(
        {
          ...playingState,
          remaining: 3,
        },
        4
      );
      expect(mockHandleInsufficientCards).toHaveBeenCalledWith(
        {
          ...playingState,
          remaining: 3,
        },
        4
      );
    });

    it("calls handleEmptyDeck when remaining is 0", async () => {
      const mockHandleEmptyDeck = jest.fn().mockResolvedValueOnce({});
      jest
        .spyOn(gameLogic, "handleEmptyDeck")
        .mockImplementationOnce(mockHandleEmptyDeck);
      mockFetchCards.mockResolvedValueOnce({
        cards: [
          { value: "10", suit: "hearts" },
          { value: "5", suit: "clubs" },
          { value: "8", suit: "diamonds" },
          { value: "7", suit: "spades" },
        ],
        deck_id: "test-deck-id",
      });

      await gameLogic.handleExistingDeck(
        {
          ...playingState,
          remaining: 0,
        },
        4
      );
      expect(mockHandleEmptyDeck).toHaveBeenCalledWith("test-deck-id", 4);
    });

    it("calls fetchCards when remaining >= 4", async () => {
      await gameLogic.handleExistingDeck(playingState, 4);
      expect(mockFetchCards).toHaveBeenCalledWith(4, "test-deck-id");
    });
  });

  describe("handleInsufficientCards", () => {
    it("handles insufficient cards correctly", async () => {
      const mockFetchCards = fetchCards as jest.Mock;
      mockFetchCards
        .mockResolvedValueOnce({
          cards: [{ value: "10", suit: "hearts" }],
          remaining: 1,
        })
        .mockResolvedValueOnce({
          cards: [
            { value: "5", suit: "clubs" },
            { value: "8", suit: "diamonds" },
            { value: "7", suit: "spades" },
          ],
          remaining: 48,
        });

      const result = await gameLogic.handleInsufficientCards(
        {
          ...playingState,
          remaining: 1,
        },
        4
      );

      expect(mockFetchCards).toHaveBeenCalledTimes(2);
      expect(returnCardsToDeck).toHaveBeenCalled();
      expect(shuffleDeck).toHaveBeenCalled();
      expect(result.cards.length).toBe(4);
      expect(result.remaining).toBe(48);
      expect(result.deckId).toBe("test-deck-id");
    });

    it("throws an error when deckId is missing", async () => {
      await expect(
        gameLogic.handleInsufficientCards(
          {
            ...playingState,
            deckId: null,
            remaining: 1,
          },
          4
        )
      ).rejects.toThrow("Deck ID is required");
    });
  });

  describe("handleEmptyDeck", () => {
    it("shuffles and fetches new cards for an empty deck", async () => {
      const mockFetchCards = fetchCards as jest.Mock;
      mockFetchCards.mockResolvedValueOnce({
        cards: [
          { value: "10", suit: "hearts" },
          { value: "5", suit: "clubs" },
          { value: "8", suit: "diamonds" },
          { value: "7", suit: "spades" },
        ],
        remaining: 48,
      });

      const result = await gameLogic.handleEmptyDeck("test-deck-id", 4);

      expect(shuffleDeck).toHaveBeenCalledWith("test-deck-id");
      expect(mockFetchCards).toHaveBeenCalledWith(4, "test-deck-id");
      expect(result.cards.length).toBe(4);
      expect(result.remaining).toBe(48);
    });
  });

  describe("createNewDeck", () => {
    it("creates a new deck and fetches initial cards", async () => {
      mockFetchCards.mockResolvedValueOnce({
        cards: [
          { value: "10", suit: "hearts" },
          { value: "5", suit: "clubs" },
          { value: "8", suit: "diamonds" },
          { value: "7", suit: "spades" },
        ],
        remaining: 48,
        deckId: "new-deck-id",
      });

      const result = await gameLogic.createNewDeck(4);

      expect(mockFetchCards).toHaveBeenCalledWith(4, "new");
      expect(result.cards.length).toBe(4);
      expect(result.remaining).toBe(48);
      expect(result.deckId).toBe("new-deck-id");
    });
  });
});
