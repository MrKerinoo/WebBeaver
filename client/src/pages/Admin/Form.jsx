import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getContactForm } from "../../api/contactApi";
import FormCard from "../../components/FormCard";

export default function Form() {
  const formsQuery = useQuery({
    queryKey: ["forms"],
    queryFn: getContactForm,
  });

  const forms = formsQuery?.data?.data?.forms || [];

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
          <span className="bg-primary px-3 text-3xl text-white sm:text-5xl md:text-6xl">
            Formuláre
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <FormCard forms={forms} />
      </div>
    </div>
  );
}
