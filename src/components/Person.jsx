import React from "react";

export default function Person({name, info, icon}) {
  return (
    <div className="person">
      <div className="person-header">
                {icon && <div className="person-icon">{icon}</div>}
                <h1>{name}</h1>
            </div>
            <p>{info}</p>
    </div>
  );
  
}
