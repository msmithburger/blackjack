import { Suit } from "@/types";

export const cardGenerator = (value: string, suit: Suit) => ({
  value,
  suit,
  code: `${value}${suit.toUpperCase()}`,
  image: `https://example.com/${value}${suit.toUpperCase()}.png`,
  images: {
    svg: `https://example.com/${value}${suit.toUpperCase()}.svg`,
    png: `https://example.com/${value}${suit.toUpperCase()}.png`,
  },
});
