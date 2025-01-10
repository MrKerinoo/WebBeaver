import React from "react";

export default function FormCard({ forms }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className="w-[80vw] pt-10 sm:w-[50vw] sm:pt-20 md:w-[60vw]">
      {forms.map((form) => (
        <div
          key={form.contactFormId}
          className="mb-8 rounded-lg border border-white bg-tertiary p-4 sm:mb-16"
        >
          <div className="mb-4 flex items-center justify-between text-sm text-white sm:text-lg">
            <p>{`${form.firstName} ${form.lastName}`}</p>

            <p className="text-secondary">
              {Intl.DateTimeFormat("sk-SK", options).format(
                new Date(form.createdAt),
              )}
            </p>
          </div>

          <div className="my-4 border-t border-white"></div>

          <div className="text-white">
            <textarea
              value={form.message}
              readOnly
              className="h-28 w-full rounded-md border bg-white p-2 text-black sm:h-32"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <p className="text-white">{form.email}</p>
            <p className="text-white">{form.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
