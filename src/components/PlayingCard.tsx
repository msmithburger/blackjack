"use client";

import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface PlayingCardProps {
  image: string;
}
export default function PlayingCard({ image }: PlayingCardProps) {
  return (
    <Card className={cn("playing-card")}>
      <img src={image} alt="Playing card" />
    </Card>
  );
}
