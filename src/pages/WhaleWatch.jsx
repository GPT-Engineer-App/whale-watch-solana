import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const fetchWhaleData = async ({ queryKey }) => {
  const [_, contractAddress, startDate, endDate] = queryKey;
  // Replace with actual API call to fetch whale data from Solana blockchain
  try {
    const response = await fetch(`/api/whales?contract=${contractAddress}&startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json(); // Ensure JSON parsing is done correctly
    return data;
  } catch (error) {
    console.error("Error fetching whale data:", error);
    throw error;
  }
};

const WhaleWatch = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["whaleData", contractAddress, startDate, endDate],
    queryFn: fetchWhaleData,
    enabled: false, // Disable automatic query execution
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { contractAddress, startDate, endDate });
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
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mb-4">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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