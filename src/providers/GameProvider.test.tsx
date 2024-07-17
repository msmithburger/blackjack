import { render } from "@testing-library/react";
import { GameProvider, useGame } from "./GameProvider";
import { useCardAPI } from "@/hooks/useCardAPI";
import { useGameReducer } from "@/hooks/useGameReducer";

jest.mock("@/hooks/useCardAPI");
jest.mock("@/hooks/useGameReducer");

// Helper component to access context
const TestComponent = () => {
  const game = useGame();
  return <div data-testid="game-context">{JSON.stringify(game)}</div>;
};

describe("GameProvider", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("provides the game context with initial state", () => {
    const mockState = {
      gameState: "initial",
      playerCards: [],
      houseCards: [],
      playerScore: 0,
      houseScore: 0,
    };
    const mockActions = {
      startGame: jest.fn(),
      hit: jest.fn(),
      stand: jest.fn(),
    };

    (useCardAPI as jest.Mock).mockReturnValue({});
    (useGameReducer as jest.Mock).mockReturnValue({
      state: mockState,
      actions: mockActions,
    });

    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const contextValue = JSON.parse(
      getByTestId("game-context").textContent || ""
    );

    expect(contextValue).toEqual({
      ...mockState,
      winner: null,
    });
  });

  it("updates winner when game ends", () => {
    const mockState = {
      gameState: "ended",
      playerCards: [],
      houseCards: [],
      playerScore: 20,
      houseScore: 18,
    };
    const mockActions = {
      startGame: jest.fn(),
      hit: jest.fn(),
      stand: jest.fn(),
    };

    (useCardAPI as jest.Mock).mockReturnValue({});
    (useGameReducer as jest.Mock).mockReturnValue({
      state: mockState,
      actions: mockActions,
    });

    const { getByTestId } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const contextValue = JSON.parse(
      getByTestId("game-context").textContent || ""
    );
    expect(contextValue.winner).toBe("player");
  });

  it("throws error when useGame is used outside of GameProvider", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useGame must be used within a GameProvider");

    consoleErrorSpy.mockRestore();
  });
});
