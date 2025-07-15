"use client";


import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { format } from 'date-fns';
import { DashboardOverview } from "./dashboard-overview";

export default function Page() {
  const { user } = useContext(UserContext);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (date?: Date) => {
    return date ? format(new Date(date), 'MM/yy') : 'N/A';
  };

  return (
    
      <>
      
        
       
    
          <DashboardOverview />
     
      
 
        </>
  );
}
