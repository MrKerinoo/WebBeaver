import React from "react";
import { Link } from "react-router-dom";

import Card from "/src/components/Card";

import DevicesIcon from "@mui/icons-material/Devices";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export default function Domov() {
  const services = [
    {
      id: 1,
      heading: "Tvorba webstránok",
      text: "Tvorba internetových stránok podľa vaších predstáv alebo to môžete nechať na nás a my sa o to postaráme.",
      icon: <DevicesIcon />,
    },
    {
      id: 2,
      heading: "Stratégia obsahu",
      text: "Naše popisy k stránkam bývajú posudzované expertmi, aby neboli zbytočne zdĺhavé a zložité, ale krátke a výstižné.",
      icon: <NewspaperIcon />,
    },
    {
      id: 3,
      heading: "Obchodné poradenstvo",
      text: "Dokážeme Vám pomôcť s marketingom Vašej značky a následným rozvojom.",
      icon: <LightbulbIcon />,
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Pneuservis Balko",
      url: "https://www.pneuservisbalko.sk/",
      image: "/src/assets/images/pneuservisBalko.png",
    },
    {
      id: 2,
      name: "Pneuservis Balko",
      url: "https://byvaj.com/",
      image: "/src/assets/images/byvaj.png",
    },
    {
      id: 3,
      name: "Zmenáreň Ružomberok",
      url: "https://www.zmenarenruzomberok.sk/",
      image: "/src/assets/images/zmenarenRuzomberok.png",
    },
  ];

  const servicesItems = services.map((service) => (
    <div key={service.id}>
      <Card heading={service.heading} text={service.text} icon={service.icon} />
    </div>
  ));

  const projectsItems = projects.map((project) => (
    <Link
      to={project.url}
      key={project.id}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={project.image} alt={project.name} />
    </Link>
  ));

  return (
    <div>
      <div className="main-container">
        <h1>Moderné webové stránky</h1>
        <p>Dizajn, tvorba a údržba</p>
      </div>

      <div className="home-services">{servicesItems}</div>

      <div className="home-projects">
        <h1>Naše projekty</h1>
        <div className="home-projects-images">{projectsItems}</div>
      </div>
    </div>
  );
}
