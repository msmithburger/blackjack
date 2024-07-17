import { renderHook } from "@testing-library/react";
import { useCardAPI } from "./useCardAPI";

// Mock the global fetch function
global.fetch = jest.fn();

describe("useCardAPI", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch cards successfully", async () => {
    const mockResponse = {
      cards: [{ suit: "HEARTS", value: "ACE" }],
      deck_id: "abc123",
      remaining: 51,
      success: true,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCardAPI());
    const { fetchCards } = result.current;

    const response = await fetchCards(1);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://deckofcardsapi.com/api/deck/new/draw/?count=1"
    );
    expect(response).toEqual({
      cards: mockResponse.cards,
      deck_id: mockResponse.deck_id,
      remaining: mockResponse.remaining,
    });
  });

  it("should throw an error when the API request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useCardAPI());
    const { fetchCards } = result.current;

    await expect(fetchCards(1)).rejects.toThrow("HTTP error! status: 500");
  });

  it("should throw an error when the API response indicates failure", async () => {
    const mockResponse = {
      success: false,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCardAPI());
    const { fetchCards } = result.current;

    await expect(fetchCards(1)).rejects.toThrow("Failed to fetch cards");
  });

  it("should use a custom deck ID when provided", async () => {
    const mockResponse = {
      cards: [],
      deck_id: "custom123",
      remaining: 52,
      success: true,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCardAPI());
    const { fetchCards } = result.current;

    await fetchCards(2, "custom123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://deckofcardsapi.com/api/deck/custom123/draw/?count=2"
    );
  });
});
