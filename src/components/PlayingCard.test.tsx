import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayingCard from "./PlayingCard";

describe("PlayingCard component", () => {
  it("renders correctly with provided image", () => {
    const testImage = "test-card-image.png";
    render(<PlayingCard image={testImage} />);

    const imgElement = screen.getByAltText("Playing card");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", testImage);
  });
});
