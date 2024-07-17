import { Card } from "@/types";

export const calculateScore = (cards: Card[]): number => {
  const initialScore = cards.reduce((score, card) => {
    if (card.value === "ACE") return score + 11;
    if (["KING", "QUEEN", "JACK"].includes(card.value)) return score + 10;
    return score + parseInt(card.value);
  }, 0);

  const aceCount = cards.filter((card) => card.value === "ACE").length;
  return adjustForAces(initialScore, aceCount);
};

const adjustForAces = (score: number, aceCount: number): number => {
  let adjustedScore = score;
  let remainingAces = aceCount;
  while (adjustedScore > 21 && remainingAces > 0) {
    adjustedScore -= 10;
    remainingAces--;
  }
  return adjustedScore;
};

export const isGameOver = (playerScore: number, houseScore: number): boolean =>
  playerScore >= 21 || houseScore >= 21;

export const determineWinner = (
  playerScore: number,
  houseScore: number
): "player" | "house" | "tie" => {
  if (playerScore > 21) return "house";
  if (houseScore > 21) return "player";
  if (playerScore === houseScore) return "tie";
  return playerScore > houseScore ? "player" : "house";
};

export const isBust = (score: number): boolean => score > 21;

export const isBlackjack = (cards: Card[]): boolean =>
  cards.length === 2 && calculateScore(cards) === 21;
