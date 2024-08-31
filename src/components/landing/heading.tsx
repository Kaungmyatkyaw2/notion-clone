import React from "react";
import EnterBtn from "./enter-btn";

const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4 w-full">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas , Documents ,& Plans. Unified. Welcome to
        <span className="underline font-extrabold"> Kotion</span>
      </h1>
      <h3 className="text-base md:text-2xl sm:text-xl font-medium">
        Kotion is the workspace where you can work
        <br /> better and faster
      </h3>
      <EnterBtn />
    </div>
  );
};

export default Heading;
