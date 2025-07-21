"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/bank-card";
import { TransactionChart } from "../../../components/user-dashboard/transaction-chart";
import { ActivityTable } from "../../../components/user-dashboard/activity-table";
import { HiArrowCircleUp } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRightIcon } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import FundsTransferModal from "../../../components/user-dashboard/funds-transfer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { format } from "date-fns";
import FundsDepositModal from "@/components/user-dashboard/funds-deposit";
import Link from "next/link";
import { api } from "@/api/axios";
import { TransactionType } from "@/lib/enums/transactionType.enum";

interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  currency: { name: string };
  createdAt: Date;
}

export default function Page() {
  const { user } = useContext(UserContext);
  const [inflow, setInflow] = useState(0);
  const [outflow, setOutflow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<
    { month: string; inflow: number; outflow: number }[]
  >([]);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (date?: Date) => {
    return date ? format(new Date(date), "MM/yy") : "N/A";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<{ transactions: Transaction[] }>(
        "/transactions"
      );
      const transactions = response.data.transactions;

      // Calculate Inflow (Deposits)
      const depositTotal = transactions
        .filter(
          (tx) =>
            tx.type === TransactionType.DEPOSIT ||
            tx.type === TransactionType.CRYPTO_DEPOSIT ||
            tx.type === TransactionType.CHEQUE_DEPOSIT
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      // Calculate Outflow (Transfers)
      const transferTotal = transactions
        .filter((tx) => tx.type === TransactionType.TRANSFER)
        .reduce((sum, tx) => sum + tx.amount, 0);

      setInflow(depositTotal);
      setOutflow(transferTotal);

      // Aggregate by month for chart
      const monthMap: Record<string, { inflow: number; outflow: number }> = {};
      transactions.forEach((tx) => {
        const date = new Date(tx.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        if (!monthMap[month]) monthMap[month] = { inflow: 0, outflow: 0 };
        if (
          tx.type === TransactionType.DEPOSIT ||
          tx.type === TransactionType.CRYPTO_DEPOSIT ||
          tx.type === TransactionType.CHEQUE_DEPOSIT
        ) {
          monthMap[month].inflow += tx.amount;
        } else if (tx.type === TransactionType.TRANSFER) {
          monthMap[month].outflow += tx.amount;
        }
      });
      // Sort months by calendar order
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const chartArr = months
        .map((m) =>
          monthMap[m]
            ? { month: m, ...monthMap[m] }
            : { month: m, inflow: 0, outflow: 0 }
        )
        .filter(
          (d, i, arr) =>
            d.inflow !== 0 || d.outflow !== 0 || i === arr.length - 1
        ); // show at least last month
      setChartData(chartArr);
    } catch (err) {
      setError("Failed to fetch transactions data.");
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 md:px-10 pt-0">
          <div className="mt-2 text-xl md:text-2xl flex flex-col lg:flex-row justify-between gap-4">
            <h2>
              Welcome Back,{" "}
              <span className="font-bold">
                {user?.firstName} {user?.lastName}
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-2 items-center">
              <FundsDepositModal />
              <FundsTransferModal />
            </div>
          </div>
          <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center bg-zinc-800 gap-4 md:gap-x-10 rounded-xl">
            <div>
              <p className="text-[18px] md:text-[20px] font-semibold text-white text-center md:text-left">
                Get a Loan in under 5 minutes
              </p>
              <p className="text-zinc-400 text-[12px] md:text-[13px] text-center md:text-left">
                Exclusive offer for extraordinary customers
              </p>
            </div>
            <div>
              <Button
                className="rounded-lg bg-transparent text-white w-full md:w-auto"
                variant="outline"
              >
                Learn More <ArrowRightIcon />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <BankCard
                balance={user?.checkingAccount.balance || 0}
                cardNumber={formatCardNumber(
                  user?.checkingAccount.cardNumber || "0"
                )}
                expiryDate={formatExpiryDate(
                  user?.checkingAccount.expirationDate
                )}
                cvc={user?.checkingAccount.cvc || "000"}
                accountName={`${user?.firstName} ${user?.lastName}`.toUpperCase()}
              />
            </div>
            <div className="bg-muted/50 rounded-xl flex flex-col h-full">
              <div className="bg-gradient-to-r from-[#F8F8F8] to-[#E4E4E4] h-full px-2 md:px-10 py-8 rounded-xl shadow-neutral-100 shadow-lg group-has-data-[collapsible=icon]/sidebar-wrapper:py-16 flex items-center justify-center">
                <div className="flex px-5 lg:px-0 justify-between items-center gap-4 md:gap-0 w-full">
                  <div className="flex flex-col">
                    <span className="bg-[#DBE7D680] text-[#213a51c2] text-sm md:text-base tracking-wider font-semibold rounded-2xl mx-auto px-6 py-0.5">
                      INFLOW
                    </span>
                    <p className="font-bold text-lg mt-2 mx-auto text-[#04C351]">
                      {isLoading
                        ? "Loading..."
                        : error
                        ? "Error"
                        : formatCurrency(inflow)}
                    </p>
                  </div>

                  <div className=" border-l border-[1.8px] mx-2 border-[#0d030334] rounded-3xl h-10 my-auto md:mx-7" />

                  <div className="flex flex-col">
                    <span className="bg-[#D0D0D080] text-[#636363bb] text-sm md:text-base tracking-wider font-semibold rounded-2xl mx-auto px-4 py-0.5">
                      OUTFLOW
                    </span>
                    <p className="font-bold text-lg mt-2 mx-auto text-[#515151bc]">
                      {isLoading
                        ? "Loading..."
                        : error
                        ? "Error"
                        : formatCurrency(outflow)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="grid grid-cols-2 gap-3 w-full h-full">
                  <Button className="bg-[#D22F2F] h-14 w-full" size="lg">
                    <HiArrowCircleUp className="size-6" />
                    TRANSACTIONS
                  </Button>

                  <Link
                    href="/user-dashboard/account-statement"
                    className="bg-[#3B3F5C] h-[100%] w-full gap-x-2 text-sm font-semibold flex items-center justify-center rounded-md text-white hover:bg-[#2E3147] transition-colors"
                  >
                    <IoMdListBox className="size-6" />
                    STATEMENT
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <TransactionChart data={chartData} />
            </div>
          </div>
          <div className="bg-muted/50 min-h-[50vh] md:min-h-[100vh] flex-1 rounded-xl">
            <ActivityTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
