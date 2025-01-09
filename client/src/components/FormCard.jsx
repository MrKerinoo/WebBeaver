import React from "react";

export default function FormCard({ forms }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className="pt-20">
      {forms.map((form) => (
        <div
          key={form.id}
          className="mb-16 rounded-lg border border-white bg-tertiary p-4"
        >
          <div className="mb-4 flex items-center justify-between text-lg text-white">
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
              className="h-32 w-full rounded-md border bg-white p-2 text-black"
            />
          </div>

          <div className="mt-4 flex items-center justify-center">
            <p className="px-5 text-white">{form.email}</p>
            <p className="px-5 text-white">{form.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
