import { Card } from "@/types";
import {
  calculateScore,
  isGameOver,
  determineWinner,
  isBust,
  isBlackjack,
} from "./gameLogic";

describe("gameLogic", () => {
  describe("calculateScore", () => {
    it("calculates score correctly for non-face cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "7" } as Card,
        { suit: "SPADES", value: "4" } as Card,
      ];
      expect(calculateScore(cards)).toBe(11);
    });

    it("calculates score correctly for face cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "KING" } as Card,
        { suit: "SPADES", value: "QUEEN" } as Card,
      ];
      expect(calculateScore(cards)).toBe(20);
    });

    it("handles Aces correctly", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "7" } as Card,
      ];
      expect(calculateScore(cards)).toBe(18);
    });

    it("adjusts Aces when score is over 21", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "ACE" } as Card,
        { suit: "DIAMONDS", value: "KING" } as Card,
      ];
      expect(calculateScore(cards)).toBe(12);
    });
  });

  describe("isGameOver", () => {
    it("returns true when player score is 21 or more", () => {
      expect(isGameOver(21, 15)).toBe(true);
      expect(isGameOver(22, 15)).toBe(true);
    });

    it("returns true when house score is 21 or more", () => {
      expect(isGameOver(15, 21)).toBe(true);
      expect(isGameOver(15, 22)).toBe(true);
    });

    it("returns false when both scores are below 21", () => {
      expect(isGameOver(20, 20)).toBe(false);
    });
  });

  describe("determineWinner", () => {
    it("returns 'house' when player busts", () => {
      expect(determineWinner(22, 20)).toBe("house");
    });

    it("returns 'player' when house busts", () => {
      expect(determineWinner(20, 22)).toBe("player");
    });

    it("returns 'tie' when scores are equal", () => {
      expect(determineWinner(20, 20)).toBe("tie");
    });

    it("returns 'player' when player score is higher", () => {
      expect(determineWinner(20, 18)).toBe("player");
    });

    it("returns 'house' when house score is higher", () => {
      expect(determineWinner(18, 20)).toBe("house");
    });
  });

  describe("isBust", () => {
    it("returns true when score is over 21", () => {
      expect(isBust(22)).toBe(true);
    });

    it("returns false when score is 21 or less", () => {
      expect(isBust(21)).toBe(false);
      expect(isBust(20)).toBe(false);
    });
  });

  describe("isBlackjack", () => {
    it("returns true for a blackjack hand", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "ACE" } as Card,
        { suit: "SPADES", value: "KING" } as Card,
      ];
      expect(isBlackjack(cards)).toBe(true);
    });

    it("returns false for a non-blackjack hand", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "10" } as Card,
        { suit: "SPADES", value: "KING" } as Card,
      ];
      expect(isBlackjack(cards)).toBe(false);
    });

    it("returns false for a 21-point hand with more than 2 cards", () => {
      const cards: Card[] = [
        { suit: "HEARTS", value: "7" } as Card,
        { suit: "SPADES", value: "7" } as Card,
        { suit: "DIAMONDS", value: "7" } as Card,
      ];
      expect(isBlackjack(cards)).toBe(false);
    });
  });
});
