import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { GiHamburgerMenu } from "react-icons/gi";

const UPLOADS_URL = import.meta.env.VITE_APP_UPLOAD_URL;

const Profile = () => {
  const { logout, user } = useAuth();

  return (
    <div className="group relative">
      {user.picture ? (
        <img
          alt="User profile"
          src={`${UPLOADS_URL}/profile_pictures/${user.picture}`}
          className="mx-5 inline-block size-10 rounded-full"
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="mx-5 size-10"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      )}

      <div className="absolute left-1/2 top-full z-40 w-28 translate-x-[-50%] translate-y-[-10px] scale-95 rounded-md bg-white p-1 opacity-0 shadow-lg transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <div className="flex flex-col items-center">
          <Link to="/onas" className="block text-base text-black">
            O nás
          </Link>
          <Link to="/kontakt" className="block text-base text-black">
            Kontakt
          </Link>
          <Link className="block text-base text-black" to="/profil">
            Profil
          </Link>

          {user.role === "ADMIN" ? (
            <div className="flex flex-col items-center">
              <Link className="block text-base text-black" to="/pouzivatelia">
                Používatelia
              </Link>
              <Link className="block text-base text-black" to="/faktury">
                Faktúry
              </Link>
              <Link className="block text-base text-black" to="/formulare">
                Formuláre
              </Link>
            </div>
          ) : (
            <Link className="block text-base text-black" to="/pouzivatel">
              Systém
            </Link>
          )}
          <button className="font-medium text-black" onClick={logout}>
            Odhlásiť sa
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const { loggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4">
      <Link className="site-logo" to="/">
        <img src="/src/assets/images/webBeaverLogo.png" alt="WebBeaver" />
      </Link>

      {loggedIn ? (
        <Profile />
      ) : (
        <div className="">
          <button
            className="z-50 block text-white sm:hidden"
            onClick={toggleMenu}
          >
            <GiHamburgerMenu className="text-2xl" />
          </button>
          <div
            ref={menuRef}
            className={`fixed right-0 top-0 z-50 w-[20vw] transform bg-white text-base shadow-lg transition-transform duration-300 ease-in-out sm:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col items-center">
              <Link
                to="/onas"
                className="block text-black"
                onClick={toggleMenu}
              >
                O nás
              </Link>
              <Link
                to="/kontakt"
                className="block text-black"
                onClick={toggleMenu}
              >
                Kontakt
              </Link>
              <Link
                to="/prihlasenie"
                className="block text-black"
                onClick={toggleMenu}
              >
                Prihlásenie
              </Link>
            </div>
          </div>

          <div className="hidden space-x-4 sm:flex">
            <Link to="/onas" className="text-white">
              O nás
            </Link>
            <Link to="/kontakt" className="text-white">
              Kontakt
            </Link>
            <Link to="/prihlasenie" className="text-white">
              Prihlásenie
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
