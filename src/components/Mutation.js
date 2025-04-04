"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import useAuth from "@/hooks/useAuth";
import useExpenses from "@/hooks/useExpenses";
import useIncome from "@/hooks/useIncome";

import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { useState } from "react";

const Mutation = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const {
    expenses,
    loading: loadingExpenses,
    deleteExpenses,
  } = useExpenses(userId);
  const { income, loading: loadingIncome, deleteIncome } = useIncome(userId);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const formatDate = (date) => {
    if (date?.toDate) {
      // Firestore Timestamp -> Convert properly
      date = date.toDate();
    } else {
      // Plain string case
      date = new Date(date);
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const sortedTransactions = [...income, ...expenses].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === "date") {
      valA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      valB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    } else if (sortBy === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = valA?.toString().toLowerCase();
      valB = valB?.toString().toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0; // If values are equal
  });

  const handleSort = (column) => {
    if (column === "date") {
      setSortBy("date");
      setSortOrder("desc"); // Always show recent first
    } else if (column === "amount") {
      setSortBy("amount");
      setSortOrder("desc"); // Always show largest first
    } else {
      // Toggle sorting for other columns
      if (sortBy === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(column);
        setSortOrder("asc");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-5 font-bold">Transaction Logs</h1>

      {/* Mobile View */}

      <div className="md:hidden space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Sort by:</span>
          <select
            className="border rounded-md p-2"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="date">Recent</option>
            <option value="amount">Highest Amount</option>
          </select>
        </div>

        {sortedTransactions.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No transactions found
          </p>
        ) : (
          sortedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{tx.username || "Unknown"}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(tx.date)}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Rp {Number(tx.amount).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <span className="text-sm capitalize bg-gray-100 px-2 py-1 rounded-md mr-2">
                    {tx.type || "N/A"}
                  </span>
                  <span className="text-sm text-gray-600">{tx.source}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                      <Delete fontSize="small" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Delete Transaction?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <DialogClose asChild>
                        <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md">
                          Cancel
                        </button>
                      </DialogClose>
                      <DialogClose asChild>
                        <button
                          onClick={() =>
                            tx.type === "income"
                              ? deleteIncome(tx.id)
                              : deleteExpenses(tx.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                          Delete
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block mt-6">
        <div className="overflow-x-auto rounded-lg shadow-md">
          <Table className="text-md border border-gray-300">
            <TableHeader className="bg-gray-200">
              <TableRow className="border-b">
                {["username", "type", "source", "date", "amount"].map((key) => (
                  <TableHead
                    key={key}
                    className="text-center px-4 py-3 cursor-pointer select-none hover:bg-gray-300 transition"
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortBy === key &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward
                          className="inline-block ml-1"
                          fontSize="small"
                        />
                      ) : (
                        <ArrowDownward
                          className="inline-block ml-1"
                          fontSize="small"
                        />
                      ))}
                  </TableHead>
                ))}
                <TableHead className="text-center px-4 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No Transactions Found
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((tx, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-100 transition"
                  >
                    <TableCell className="text-center px-4 py-3">
                      {tx.username || "Unknown"}
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      {tx.type
                        ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      {tx.source}
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      <p>Rp. {Number(tx.amount).toLocaleString()}</p>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-white bg-red-500 rounded p-2 hover:bg-red-800 cursor-pointer">
                            <Delete />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Transaction?</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            This action cannot be undone.
                          </DialogDescription>
                          <DialogFooter>
                            <DialogClose asChild>
                              <button
                                className="bg-red-500 rounded text-white hover:bg-red-600 transition ease-in-out w-40 p-3 my-3 mx-3 flex-1 cursor-pointer"
                                onClick={() => {
                                  tx.type === "income"
                                    ? deleteIncome(tx.id)
                                    : deleteExpenses(tx.id);
                                }}
                              >
                                Delete
                              </button>
                            </DialogClose>
                            <DialogClose asChild>
                              <button
                                type="button"
                                className="outline-2 rounded text-gray-500 hover:bg-gray-200 hover:outline-1 transition ease-in-out w-40 p-3 my-3 mx-3 flex-1 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Mutation;
