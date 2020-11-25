import { render, fireEvent, screen } from "@testing-library/react";
import Nav from "../components/nav"


describe("Navbar", () => {
  it("renders without crashing", () => {
    render(<Nav />);
    expect(
      screen.getByText("Elena")
    ).toBeInTheDocument();
  });
});