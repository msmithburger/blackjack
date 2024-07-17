"use client";

import { useGame } from "@/providers/GameProvider";
import PlayingCard from "./PlayingCard";

export default function PlayingTable() {
  const { playerCards, houseCards } = useGame();

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-col items-center border border-gray-200 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">House Cards</h2>
        <div className="flex space-x-2">
          {houseCards.map((card) => (
            <PlayingCard key={card.code} image={card.image} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center border border-gray-200 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Your Cards</h2>
        <div className="flex space-x-2">
          {playerCards.map((card) => (
            <PlayingCard key={card.code} image={card.image} />
          ))}
        </div>
      </div>
    </div>
  );
}
