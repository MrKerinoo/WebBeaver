import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getFiles } from "../../api/fileApi";
import { useAuth } from "../../hooks/useAuth";

export default function Pouzivatel() {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const { user } = useAuth();

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getFiles(user),
  });

  const invoices = invoicesQuery?.data?.data?.invoices || [];

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pt-5"
        >
          <div className="w-[90vw] border-t border-white" />
        </div>
        <div className="relative flex justify-center pt-5">
          <span className="bg-primary px-3 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Faktúry
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-4 pb-5 pt-10">
        <h1 className="text-xl text-white">Zoznam vašich faktúr</h1>
        <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {invoices.map((invoice, index) => (
            <li
              key={invoice.invoiceId}
              className="flex gap-y-4 rounded-lg border border-white p-2 sm:flex-row sm:justify-between sm:gap-x-6 sm:pb-5"
            >
              <div className="flex-auto">
                <p className="pb-2 text-xl font-semibold text-white">
                  #{index + 1}{" "}
                  <span
                    className={`${
                      invoice.state === "NEZAPLATENÁ"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {invoice.state}
                  </span>
                </p>
                <a
                  href={`/${invoice.file.path}`}
                  download
                  className="text-secondary hover:underline"
                >
                  Stiahnuť faktúru
                </a>
              </div>
              <div className="pl-3 text-white">
                {Intl.DateTimeFormat("sk-SK", options).format(
                  new Date(invoice.expirationDate),
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
