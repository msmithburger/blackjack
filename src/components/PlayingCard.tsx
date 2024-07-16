"use client";

import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";

interface PlayingCardProps {
  suit: Suit;
  value: string;
}

const suitSymbols: { [key in Suit]: string } = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export default function PlayingCard({ suit, value }: PlayingCardProps) {
  return (
    <Card className={cn("playing-card", suit)}>
      <div className="card-corner top-left">
        <div className="card-value">{value}</div>
        <div className="card-suit">{suitSymbols[suit]}</div>
      </div>
      <div className="card-center">{suitSymbols[suit]}</div>
      <div className="card-corner bottom-right">
        <div className="card-value">{value}</div>
        <div className="card-suit">{suitSymbols[suit]}</div>
      </div>
    </Card>
  );
}
