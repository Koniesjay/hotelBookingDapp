import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles/Home.css";
import Header from "./components/Header";
import Booking from "./components/Booking";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="">
      <Header />
      <Toaster richColors />
      <Booking />
    </main>
  );
}
