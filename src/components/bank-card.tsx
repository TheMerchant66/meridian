"use client";

import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { LuNfc } from "react-icons/lu";
import { SiVisa } from "react-icons/si";
import { useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { toast } from "react-hot-toast";

interface BankCardProps {
  balance: number;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  accountName: string;
}

export function BankCard({
  balance,
  cardNumber,
  expiryDate,
  cvc,
  accountName,
}: BankCardProps) {
  const { user } = useContext(UserContext);
  const [showBalance, setShowBalance] = useState(true);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedCardNumber = cardNumber.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2');

  const copyToClipboard = async () => {
    if (!user?.checkingAccount?.accountNumber) return;
    try {
      await navigator.clipboard.writeText(user.checkingAccount.accountNumber);
      setCopied(true);
      toast.success('Account number copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy account number');
    }
  };

  return (
    <div className="bg-zinc-800 rounded-t-xl rounded-b-2xl h-full flex flex-col">
      <div className="flex flex-col text-white gap-y-4 md:gap-y-7 px-5 sm:px-5 pt-5 flex-1">
        <div className="flex justify-between">
          <span className="text-zinc-300 text-sm font-semibold">{accountName}</span>
          <LuNfc className="text-2xl" />
        </div>
        <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-x-4">
          <div>
            <span className="text-[13px] text-zinc-400">Available Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-[25px] font-semibold">
                {showBalance ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(balance) : "****"}
              </span>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? (
                  <Eye className="h-4 w-4 cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[12px] text-zinc-400">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="text-[18px] tracking-wide font-semibold">
                {showBalance ? user?.checkingAccount?.accountNumber : "****"}
              </span>
              {showBalance && (
                <button 
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-zinc-700 rounded-md transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-4 md:mt-5 gap-x-7 px-5 sm:px-8 pb-3 pt-1 items-center text-slate-800 bg-blue-200 rounded-b-xl">
        <div>
          <span className="text-[10.5px] text-slate-600">Card Number</span>
          <p className="text-[13.5px] font-semibold">
            {showCardNumber ? cardNumber : maskedCardNumber}
          </p>
        </div>

        <div>
          <span className="text-[10.5px] text-slate-600">Exp</span>
          <p className="text-[13.5px] font-semibold">{expiryDate}</p>
        </div>

        <div>
          <span className="text-[10.5px] text-slate-600">CVC</span>
          <p className="text-[13.5px] font-semibold">{cvc}</p>
        </div>

        <div className="ml-auto">
          <SiVisa className="text-4xl" />
        </div>
      </div>
    </div>
  );
} 