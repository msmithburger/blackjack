type ApiResponse = {
  success: boolean;
  deck_id: string;
  remaining: number;
};

type Card = {
  code: string;
  image: string;
  images: { svg: string; png: string };
  value: string;
  suit: string;
};

export type { Card, ApiResponse };
