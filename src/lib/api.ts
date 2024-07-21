import { ApiResponse, Card } from "@/types";

export const fetchCards = async (count: number, curDeckId: string = "new") => {
  const response: Response = await fetch(
    `https://deckofcardsapi.com/api/deck/${curDeckId}/draw/?count=${count}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse & { cards: Card[] } = await response.json();
  const { cards, deck_id: deckId, remaining, success } = data;

  if (!success) {
    throw new Error("Failed to fetch cards");
  }

  return { cards, deckId, remaining };
};

export const shuffleDeck = async (deckId: string) => {
  const response: Response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse & { shuffled: boolean } = await response.json();
  const { success, shuffled } = data;

  if (!success || !shuffled) {
    throw new Error("Failed to shuffle deck");
  }

  return true;
};

export const returnCardsToDeck = async (deckId: string, cards: string[]) => {
  const response: Response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/return/?cards=${cards.join(
      ","
    )}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse & {
    piles: { [key: string]: { remaining: number } };
  } = await response.json();
  const { success } = data;

  if (!success) {
    throw new Error("Failed to return cards to deck");
  }

  return true;
};
