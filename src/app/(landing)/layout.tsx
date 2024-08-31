import React from "react";
import Navbar from "../../components/landing/navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-36 ">{children}</main>
    </div>
  );
};

export default LandingLayout;
