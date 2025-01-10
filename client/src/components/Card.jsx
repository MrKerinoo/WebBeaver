import React from "react";

export default function Card({ icon, heading, text }) {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        <h1>{heading}</h1>
      </div>
      <p>{text}</p>
    </div>
  );
}
