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

describe("Create page – immutable state updates", () => {
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

  it("updateMilestone does not mutate the previous milestone object", async () => {
    render(<CreateJob />);

    const addBtn = screen.getByRole("button", { name: /add milestone/i });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    const input = screen.getByLabelText("Milestone 2 amount in stroops");

    await act(async () => {
      fireEvent.change(input, { target: { value: "100" } });
    });

    expect(input).toHaveValue(100);

    await act(async () => {
      fireEvent.change(input, { target: { value: "200" } });
    });

    expect(input).toHaveValue(200);
  });
});
