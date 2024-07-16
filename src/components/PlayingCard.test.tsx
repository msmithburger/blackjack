import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayingCard from "./PlayingCard";

describe("PlayingCard component", () => {
  it("renders correctly with hearts suit", () => {
    render(<PlayingCard suit="hearts" value="A" />);
    expect(screen.getAllByText("A")).toHaveLength(2);
    expect(screen.getAllByText("♥")).toHaveLength(3);
  });

  it("renders correctly with diamonds suit", () => {
    render(<PlayingCard suit="diamonds" value="K" />);
    expect(screen.getAllByText("K")).toHaveLength(2);
    expect(screen.getAllByText("♦")).toHaveLength(3);
  });

  it("renders correctly with clubs suit", () => {
    render(<PlayingCard suit="clubs" value="Q" />);
    expect(screen.getAllByText("Q")).toHaveLength(2);
    expect(screen.getAllByText("♣")).toHaveLength(3);
  });

  it("renders correctly with spades suit", () => {
    render(<PlayingCard suit="spades" value="J" />);
    expect(screen.getAllByText("J")).toHaveLength(2);
    expect(screen.getAllByText("♠")).toHaveLength(3);
  });
});
