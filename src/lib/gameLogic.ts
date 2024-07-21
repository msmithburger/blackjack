import { State } from "@/hooks/useGameReducer";
import { Card } from "@/types";
import { fetchCards, returnCardsToDeck, shuffleDeck } from "./api";

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

// Create a discard pile from the player and house cards. This assumes that the player and house
// cards are the only cards in play and the deck is empty.
export const createDiscardPileFromHands = (
  playerCards: Card[],
  houseCards: Card[]
): string[] => {
  const allCards = [...playerCards, ...houseCards];
  const allCardCodes = allCards.map((card) => card.code);
  const suits = ["S", "H", "D", "C"];
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "J",
    "Q",
    "K",
  ];
  const fullDeck = suits.flatMap((suit) =>
    values.map((value) => `${value}${suit}`)
  );
  return fullDeck.filter((cardCode) => !allCardCodes.includes(cardCode));
};

export const getCards = async (state: State, numCards: number) => {
  if (state.deckId) {
    return handleExistingDeck(state, numCards);
  }
  return createNewDeck(numCards);
};

export const handleExistingDeck = async (state: State, numCards: number) => {
  if (!state.deckId) {
    throw new Error("Deck ID is required");
  }

  if (state.remaining === 0) {
    return handleEmptyDeck(state.deckId, numCards);
  }

  if (state.remaining < numCards) {
    return handleInsufficientCards(state, numCards);
  }

  return fetchCards(numCards, state.deckId);
};

export const handleInsufficientCards = async (
  state: State,
  numCards: number
) => {
  if (!state.deckId) {
    throw new Error("Deck ID is required");
  }
  const { cards: lastCardsRemaining } = await fetchCards(
    state.remaining,
    state.deckId
  );
  await returnCardsToDeck(
    state.deckId,
    createDiscardPileFromHands(state.playerCards, state.houseCards)
  );
  await shuffleDeck(state.deckId);
  const { cards: newCards, remaining } = await fetchCards(
    numCards - state.remaining,
    state.deckId
  );
  return {
    cards: [...lastCardsRemaining, ...newCards],
    remaining,
    deckId: state.deckId,
  };
};

export const handleEmptyDeck = async (deckId: string, numCards: number) => {
  await shuffleDeck(deckId);
  return fetchCards(numCards, deckId);
};

export const createNewDeck = async (numCards: number) => {
  return fetchCards(numCards, "new");
};
