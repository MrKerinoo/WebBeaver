import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UPLOADS_URL = import.meta.env.VITE_APP_UPLOAD_URL;

const Profile = () => {
  const { logout, user } = useAuth();

  console.log("USER", user);
  return (
    <div className="group relative">
      {user.picture ? (
        <img
          alt=""
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
      <div className="absolute right-0 z-40 w-28 translate-y-[-50px] rounded-md bg-white p-1 opacity-0 shadow-lg transition-all duration-300 ease-in-out group-hover:block group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex flex-col items-center">
          <Link className="block text-black" to="/profil">
            Profil
          </Link>
          {user.role === "ADMIN" ? (
            <div>
              <Link className="block text-black" to="/admin">
                Systém
              </Link>
              <Link className="block text-black" to="/faktury">
                Faktúry
              </Link>
            </div>
          ) : (
            <Link className="block text-black" to="/pouzivatel">
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

  return (
    <header>
      <Link className="site-logo" to="/">
        <img src="/src/assets/images/webBeaverLogo.png" alt="WebBeaver" />
      </Link>
      <nav>
        <Link to="/onas">O nás</Link>
        <Link to="/kontakt">Kontakt</Link>
      </nav>
      {loggedIn ? <Profile /> : <Link to="/prihlasenie">Prihlásenie</Link>}
    </header>
  );
}
