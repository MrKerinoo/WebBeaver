import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-tertiary pt-10 pb-5 w-full">
      <div className="flex justify-center pb-10">
        <nav className="flex justify-between w-full max-w-96">
          <Link to="/onas" className="text-white text-center w-full">
            O nás
          </Link>
          <Link to="/kontakt" className="text-white text-center w-full">
            Kontakt
          </Link>
          <Link to="/pouzivatelia" className="text-white text-center w-full">
            Používatelia
          </Link>
        </nav>
      </div>

      <div className="flex justify-center">
        <Link to="/" onClick={handleLogoClick}>
          <img
            src="/src/assets/images/webBeaverLogo.png"
            alt="WebBeaver"
            className="max-w-[300px]"
          />
        </Link>
      </div>

      <div className="flex justify-center space-x-4">
        <p className="text-white">&copy; 2024 WebBeaver</p>
        <p className="text-white">Všetky práva vyhradené</p>
      </div>
    </footer>
  );
}
