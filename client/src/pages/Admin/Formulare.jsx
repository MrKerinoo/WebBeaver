import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getContactForm } from "../../api/contactApi";
import FormCard from "../../components/FormCard";

export default function Formulare() {
  const formsQuery = useQuery({
    queryKey: "forms",
    queryFn: getContactForm,
  });

  console.log(formsQuery?.data?.data?.forms);
  const forms = formsQuery?.data?.data?.forms || [];

  return (
    <div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white" />
        </div>
        <div className="relative flex justify-center">
          <h1 className="bg-primary px-3 text-6xl font-normal text-white">
            FORMULÁRE
          </h1>
        </div>
      </div>

      <FormCard forms={forms} />
    </div>
  );
}
