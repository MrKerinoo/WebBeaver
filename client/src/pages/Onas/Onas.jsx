import React from "react";

import { HiOutlineDesktopComputer } from "react-icons/hi";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";

export default function Onas() {
  const persons = [
    {
      id: 1,
      name: "Marek",
      role: "Programátor",
      icon: <HiOutlineDesktopComputer className="text-4xl" />,
    },
    {
      id: 2,
      name: "Tomáš",
      role: "Grafik",
      icon: <HiOutlinePencil className="text-4xl" />,
    },
    {
      id: 3,
      name: "Eva",
      role: "Projektová manažérka",
      icon: <HiOutlineUserGroup className="text-4xl" />,
    },
    {
      id: 4,
      name: "Jozef",
      role: "SEO špecialista",
      icon: <HiOutlineSearch className="text-4xl" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="main-container">
        <h1>O nás</h1>
        <p>Spoznajte náš tím a niečo o našej firme</p>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Title and description */}
          <div className="mb-16 text-center">
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Spoznajte náš tím
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Sme tím programátorov a grafikov, ktorý sa snaží priniesť do sveta
              kvalitné webové stránky.
            </p>
          </div>

          <div className="team-container">
            {persons.map((person) => (
              <div
                key={person.id}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">{person.icon}</div>
                <h3 className="text-base font-semibold tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-sm font-semibold text-secondary">
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
