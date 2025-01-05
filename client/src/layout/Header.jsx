import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { loggedIn, logout, user } = useContext(AuthContext);

  return (
    <header>
      <Link className="site-logo" to="/">
        <img src="/src/assets/images/webBeaverLogo.png" alt="WebBeaver" />
      </Link>
      <nav>
        <Link to="/onas">O nás</Link>
        <Link to="/kontakt">Kontakt</Link>
        <Link to="/pouzivatelia">Používatelia</Link>
        {loggedIn ? (
          <button className="text-white" onClick={logout}>
            Odhlásiť sa
          </button>
        ) : (
          <Link to="/prihlasenie">Prihlásenie</Link>
        )}
      </nav>
    </header>
  );
}
