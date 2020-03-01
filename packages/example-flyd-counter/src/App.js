import React from "react";
import { Counter } from "./Counter";

export default function App() {
  return (
    <>
      <div className="ui medium header demo-title">
        useStream with Flyd example: Simple counter
      </div>
      <Counter id="1" count={0} />
      <Counter id="2" count={100} />
    </>
  );
}
