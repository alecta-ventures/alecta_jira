import React from "react";
import Navx from "./Navx";

const Layout = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col">
      <Navx></Navx>
      <main className="flex-grow py-8 px-4 md:p-8">{children}</main>
    </div>
  );
};

export default Layout;
