import { Networks } from "@stellar/stellar-sdk";

export const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE || Networks.TESTNET;
export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";
