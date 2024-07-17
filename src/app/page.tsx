import Controls from "@/components/Controls";
import PlayingTable from "@/components/PlayingTable";
import { GameProvider } from "@/providers/GameProvider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <GameProvider>
          <PlayingTable />
          <Controls />
        </GameProvider>
      </div>
    </main>
  );
}
