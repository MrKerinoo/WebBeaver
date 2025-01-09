import React from "react";

export default function InputField({
  name,
  value,
  onChange,
  placeHolder,
  error,
}) {
  return (
    <div>
      <input
        className={`input-field ${error ? "error" : ""}`}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
      />
    </div>
  );
}
