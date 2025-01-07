import React, { useState } from "react";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { uploadFile } from "../api/fileApi";
import { useAuth } from "../hooks/useAuth";

export default function FileUploader() {
  const { user } = useAuth();

  const states = {
    idle: "idle",
    loading: "loading",
    success: "success",
    error: "error",
  };

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function handleFileUpload() {
    if (!file) return;

    setStatus(states.loading);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", JSON.stringify(user));

    try {
      uploadFile(formData);
      setStatus(states.success);
      console.log(status);
    } catch (err) {
      setStatus(states.error);
    }
  }

  return (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-secondary px-6 py-10">
      <div className="text-center">
        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-white" />
        <div className="mt-4 flex text-sm/6 text-white">
          <label
            htmlFor="file"
            className="relative cursor-pointer rounded-md font-semibold text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>Nahrajte súbor</span>
            <input
              type="file"
              id="file"
              name="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">alebo potiahnite a hoďte</p>
        </div>
        <p className="text-xs/5 text-gray-600">PNG, JPG, SVG</p>
        {file && (
          <div className="text-sm text-white">
            <p>{file.name}</p>
            <p>{(file.size / 1024).toFixed(2)} KB</p>
            <p>{file.type}</p>
          </div>
        )}
        {file && status !== states.loading && (
          <button
            type="button"
            className="hover:bg-secondary-dark mt-4 inline-flex items-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm/6 font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            onClick={handleFileUpload}
          >
            Nahrať súbor
          </button>
        )}
      </div>
    </div>
  );
}
