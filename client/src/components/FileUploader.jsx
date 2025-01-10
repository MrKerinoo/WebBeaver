import React, { useState } from "react";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { uploadPicture } from "../api/fileApi";
import { useAuth } from "../hooks/useAuth";

export default function FileUploader({ setFile, types }) {
  const { user } = useAuth();

  const states = {
    idle: "idle",
    loading: "loading",
    success: "success",
    error: "error",
  };

  const [localFile, setLocalFile] = useState(null);
  const [status, setStatus] = useState("idle");

  function handleFileChange(e) {
    if (e.target.files) {
      const file = e.target.files[0];
      setLocalFile(file);
      setFile(file);
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
        <p className="text-xs/5 text-gray-600">
          {types ? "PNG, JPG, SVG" : null}
        </p>
        {localFile && (
          <div className="text-sm text-white">
            <p>{localFile.name}</p>
            <p>{(localFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
    </div>
  );
}
