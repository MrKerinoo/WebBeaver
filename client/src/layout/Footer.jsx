import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-tertiary pb-5 pt-10">
      <div className="flex justify-center pb-10">
        <nav className="flex w-full max-w-96 justify-between">
          <Link to="/onas" className="w-full text-center text-white">
            O nás
          </Link>
          <Link to="/kontakt" className="w-full text-center text-white">
            Kontakt
          </Link>
        </nav>
      </div>

      <div className="mb-5 flex justify-center">
        <Link to="/" onClick={handleLogoClick}>
          <img
            src="/src/assets/images/webBeaverLogo.png"
            alt="WebBeaver"
            className="w-60"
          />
        </Link>
      </div>

      <div className="flex justify-center space-x-4 text-sm sm:text-base">
        <p className="text-white">&copy; 2024 WebBeaver</p>
        <p className="text-white">Všetky práva vyhradené</p>
      </div>
    </footer>
  );
}
