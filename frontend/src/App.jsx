import React from "react";
import DepositButton from "./components/DepositButton";

export default function App() {
  const escrow = import.meta.env.VITE_ESCROW_ADDRESS || "PASTE_ESCROW_ADDRESS_HERE";
  return (
    <div style={{padding:20}}>
      <h2>Algorand Launchpad - Frontend</h2>
      <DepositButton escrowAddress={escrow} />
      <p>Use this to deposit TestNet ALGO into the escrow address.</p>
    </div>
  );
}