import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Controls from "./Controls";

// Mock the useGame hook
jest.mock("@/providers/GameProvider", () => ({
  useGame: jest.fn(),
}));

describe("Controls component", () => {
  const mockUseGame = jest.requireMock("../providers/GameProvider").useGame;

  beforeEach(() => {
    mockUseGame.mockReset();
  });

  it("renders Deal button in initial state", () => {
    mockUseGame.mockReturnValue({
      gameState: "initial",
      startGame: jest.fn(),
    });

    render(<Controls />);
    expect(screen.getByText("Deal")).toBeInTheDocument();
  });

  it("renders Hit and Stand buttons in playing state", () => {
    mockUseGame.mockReturnValue({
      gameState: "playing",
      hit: jest.fn(),
      stand: jest.fn(),
    });

    render(<Controls />);
    expect(screen.getByText("Hit")).toBeInTheDocument();
    expect(screen.getByText("Stand")).toBeInTheDocument();
  });

  it("renders New Game button in ended state", () => {
    mockUseGame.mockReturnValue({
      gameState: "ended",
      startGame: jest.fn(),
    });

    render(<Controls />);
    expect(screen.getByText("New Game")).toBeInTheDocument();
  });

  it("displays player and house scores", () => {
    mockUseGame.mockReturnValue({
      gameState: "playing",
      playerScore: 15,
      houseScore: 17,
    });

    render(<Controls />);
    expect(screen.getByText("Your Score: 15")).toBeInTheDocument();
    expect(screen.getByText("House Score: 17")).toBeInTheDocument();
  });

  it("calls startGame when Deal button is clicked", () => {
    const startGameMock = jest.fn();
    mockUseGame.mockReturnValue({
      gameState: "initial",
      startGame: startGameMock,
    });

    render(<Controls />);
    fireEvent.click(screen.getByText("Deal"));
    expect(startGameMock).toHaveBeenCalled();
  });

  it("calls hit when Hit button is clicked", () => {
    const hitMock = jest.fn();
    mockUseGame.mockReturnValue({
      gameState: "playing",
      hit: hitMock,
      stand: jest.fn(),
    });

    render(<Controls />);
    fireEvent.click(screen.getByText("Hit"));
    expect(hitMock).toHaveBeenCalled();
  });

  it("calls stand when Stand button is clicked", () => {
    const standMock = jest.fn();
    mockUseGame.mockReturnValue({
      gameState: "playing",
      hit: jest.fn(),
      stand: standMock,
    });

    render(<Controls />);
    fireEvent.click(screen.getByText("Stand"));
    expect(standMock).toHaveBeenCalled();
  });
});
