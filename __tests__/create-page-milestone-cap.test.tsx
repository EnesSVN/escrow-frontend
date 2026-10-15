import { fireEvent, render, screen, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateJob from "@/app/create/page";

const mockUseWallet = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/app/components/Navbar", () => ({
  default: () => <div data-testid="navbar" />,
}));

vi.mock("@/app/context/WalletContext", () => ({
  useWallet: () => mockUseWallet(),
}));

describe("Create page – milestone cap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ address: "CTOKEN", symbol: "USDC" }],
        }),
      }),
    );
    mockUseWallet.mockReturnValue({
      address: "GCLIENTADDRESS",
      signTransaction: vi.fn(),
    });
  });

  it("disables the add button at 10 milestones and shows the cap hint", async () => {
    render(<CreateJob />);

    const addBtn = screen.getByRole("button", { name: /add milestone/i });

    for (let i = 0; i < 9; i++) {
      await act(async () => {
        fireEvent.click(addBtn);
      });
    }

    expect(addBtn).toBeDisabled();
    expect(screen.getByTestId("milestone-cap-hint")).toBeInTheDocument();
    expect(screen.getByTestId("milestone-cap-hint")).toHaveTextContent(
      "Up to 10 milestones per escrow",
    );
  });

  it("does not show the cap hint when under the limit", () => {
    render(<CreateJob />);

    expect(screen.queryByTestId("milestone-cap-hint")).not.toBeInTheDocument();
  });
});
