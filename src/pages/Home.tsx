import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../css/cover.css";

const Home: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyMessageRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (
    text: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault(); // Prevent default link behavior
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied && copyMessageRef.current) {
      copyMessageRef.current.classList.add("show");
      setTimeout(() => {
        if (copyMessageRef.current) {
          copyMessageRef.current.classList.remove("show");
        }

        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  return (
    <div className="d-flex h-100 text-center text-white bg-dark">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">Cover</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/about">
                About
              </Link>
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main className="px-3">
          <h1>Welcome Friend!</h1>
          <p className="lead">
            This is a side project where I can experiement with different ideas.
          </p>
          <p className="lead">
            <Link
              to="/about"
              className="btn btn-lg btn-secondary fw-bold border-white bg-white text-dark"
            >
              I'm Alex
            </Link>
          </p>
        </main>

        <footer className="mt-auto text-white-50">
          <p>
            Contact me at{" "}
            <a
              href="bwell0@duck.com"
              className="text-white"
              onClick={(event) => copyToClipboard("bwell0@duck.com", event)}
            >
              bwell0@duck.com
            </a>
          </p>
          <div ref={copyMessageRef} className="copy-message">
            Copied!
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
