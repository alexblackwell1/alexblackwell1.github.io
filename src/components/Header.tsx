import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

interface HeaderLink {
  to: string;
  label: string;
}

interface HeaderProps {
  title: string;
  currentPage: string;
  links: HeaderLink[];
}

const Header: React.FC<HeaderProps> = ({ title, currentPage, links }) => {
  const { user, signin, signout } = useContext(AuthContext);

  return (
    <header className="d-flex justify-content-between align-items-center py-3">
      <h3 className="mb-0">{title}</h3>
      <nav className="nav nav-masthead justify-content-center align-items-center">
        {links.map((link, index) => (
          <Link
            key={index}
            className={`nav-link nav-link-underline ${
              currentPage === link.to ? "active" : ""
            }`}
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
        <div className="nav-link">
          {user ? (
            <div className="d-flex align-items-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  onClick={signout}
                  className="profile-picture"
                />
              ) : (
                <FaUser onClick={signout} className="profile-icon" />
              )}
            </div>
          ) : (
            <button className="btn btn-sm btn-light" onClick={signin}>
              Sign In with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
