import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

const Header = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Hotel Booking</a>
      </div>
      <div className="flex-none">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
