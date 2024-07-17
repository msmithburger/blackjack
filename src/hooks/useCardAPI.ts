import { ApiResponse, Card } from "@/types";

export const useCardAPI = () => {
  const fetchCards = async (count: number, deckId: string = "new") => {
    const response: Response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse & { cards: Card[] } = await response.json();
    const { cards, deck_id, remaining, success } = data;

    if (!success) {
      throw new Error("Failed to fetch cards");
    }

    return { cards, deck_id, remaining };
  };

  return { fetchCards };
};
