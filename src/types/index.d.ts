type ApiResponse = {
  success: boolean;
  deck_id: string;
  remaining: number;
};

type Suit = "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES";

type Card = {
  code: string;
  image: string;
  images: { svg: string; png: string };
  value: string;
  suit: Suit;
};

export type { Card, ApiResponse, Suit };
