import React from "react";

import Person from "/src/components/Person";

import BrushIcon from "@mui/icons-material/Brush";
import CodeIcon from "@mui/icons-material/Code";

export default function Onas() {
  const persons = [
    { id: 1,name: "Marek", info: "Programátor", icon: <CodeIcon fontSize="large"/> },
    { id: 2, name: "Tomáš", info: "Grafik", icon: <BrushIcon fontSize="large"/> },
  ];

  const personsItems = persons.map((person) => (
    <Person key={person.id} name={person.name} info={person.info} icon={person.icon} />
  ));

  return (
    <div>
      <div className="main-container">
        <h1>O nás</h1>
        <p> Spoznajte náš tím a prečo si vybrať práve nás. </p>
      </div>

      <div className="about-container">
        <h1> Náš tím </h1>

        <div className="persons-container">{personsItems}</div>
      </div>
    </div>
  );
}
