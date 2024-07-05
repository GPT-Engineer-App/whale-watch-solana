import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

const fetchWhaleData = async ({ queryKey }) => {
  const [_, contractAddress, timePeriod] = queryKey;
  // Replace with actual API call to fetch whale data from Solana blockchain
  const response = await fetch(`/api/whales?contract=${contractAddress}&timePeriod=${timePeriod}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const WhaleWatch = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["whaleData", contractAddress, timePeriod],
    queryFn: fetchWhaleData,
    enabled: false, // Disable automatic query execution
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Whale Watcher</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <Label htmlFor="contractAddress">Contract Address</Label>
          <Input
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="timePeriod">Time Period</Label>
          <Input
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buy Date</TableHead>
              <TableHead>Amount of Coins</TableHead>
              <TableHead>Highest Value Until Sold</TableHead>
              <TableHead>Profit Made</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((whale) => (
              <TableRow key={whale.buyDate}>
                <TableCell>{whale.buyDate}</TableCell>
                <TableCell>{whale.amount}</TableCell>
                <TableCell>{whale.highestValue}</TableCell>
                <TableCell>{whale.profit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default WhaleWatch;