import React from "react";
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <header>
            <Link to="/">#WEBBEAVER</Link>
            <nav>
                <Link to ="/onas">O nás</Link>
                <Link to ="/kontakt">Kontakt</Link>
            </nav>
        </header>
    );
}