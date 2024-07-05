import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl">Welcome to Whale Watcher</h1>
      <p>Use the navigation to start watching whales on the Solana blockchain.</p>
      <Link to="/whale-watch" className="text-blue-500 underline">
        Go to Whale Watch
      </Link>
    </div>
  );
};

export default Index;