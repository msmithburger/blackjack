import Controls from "@/components/Controls";
import PlayingCard from "@/components/PlayingCard";
import { GameProvider } from "@/providers/GameProvider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <GameProvider>
          <PlayingCard suit="hearts" value="A" />
          <PlayingCard suit="diamonds" value="K" />
          <PlayingCard suit="clubs" value="Q" />
          <PlayingCard suit="spades" value="J" />

          <Controls />
        </GameProvider>
      </div>
    </main>
  );
}
