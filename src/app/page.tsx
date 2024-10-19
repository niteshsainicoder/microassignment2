'use client';

import BarLineChart from "@/components/Chart";
// import { BarChart, LineChart } from "@/components/Chart";
import Form from "@/components/Form";
import Nav from "@/components/navBar";
import { useEffect, useState } from "react";
import useDataContext from "./ContextApi";

export default function Home() {
  const { logedin, setlogedin, setFilters } = useDataContext();
  const [authpop, setauthpop ]= useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('age') || urlParams.has('gender') || urlParams.has('startDate') || urlParams.has('endDate')) {
        setFilters({
          ageRange: urlParams.get('age') || '',
          gender: urlParams.get('gender') || '',
          dateRange: { startDate: Number(urlParams.get('startDate')) || 44838, endDate: Number(urlParams.get('endDate')) || 44864 },
        });
      }

    }, 1000)
    setTimeout(() => {

      setauthpop(true)
    }, 700);
  }, [])

  useEffect(() => {
    if (logedin) {
      
      setauthpop(false);
    }
  }, [logedin]);

  return (
    <main className="flex min-h-screen border-2 flex-col items-center select-none justify-start   bg-slate-200 ">
      <Nav logedin={logedin} setauth={setauthpop} setlogedin={setlogedin} />
      {authpop  && <Form auth={authpop} setauth={setauthpop} setlogedin={setlogedin} />}
      <div className="w-full h-full">
        {logedin ?
          <BarLineChart /> :
          <div className="w-full h-screen flex justify-center items-center">
            <h1 className="text-3xl font-bold text-center text-gray-600 shadow-2xl antialiased">Log In first to see your data</h1>
          </div>}
      </div>
    </main>
  );
}
