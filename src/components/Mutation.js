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
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-5 font-bold">Transaction Logs</h1>
      <div className="mt-10">
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
              {sortedTransactions.map((tx, index) => (
                <TableRow key={index} className="hover:bg-gray-100 transition">
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
                          <DialogTitle>Delete Transaction</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          Are you sure you want to delete this transaction?
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Mutation;
