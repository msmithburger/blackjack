import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayingCard from "./PlayingCard";

describe("Card component", () => {
  it("renders correctly", () => {
    render(<PlayingCard suit="hearts" value="A" />);
    expect(screen.getByText("A♥")).toBeInTheDocument();
  });

  it("renders the correct suit symbol for diamonds", () => {
    render(<PlayingCard suit="diamonds" value="K" />);
    expect(screen.getByText("K♦")).toBeInTheDocument();
  });

  it("renders the correct suit symbol for clubs", () => {
    render(<PlayingCard suit="clubs" value="Q" />);
    expect(screen.getByText("Q♣")).toBeInTheDocument();
  });

  it("renders the correct suit symbol for spades", () => {
    render(<PlayingCard suit="spades" value="J" />);
    expect(screen.getByText("J♠")).toBeInTheDocument();
  });
});
