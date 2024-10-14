import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../css/cover.css";

interface SectionItem {
  title: string;
  description: string;
  date?: string;
}

interface SectionProps {
  title: string;
  items: SectionItem[];
  isEven: boolean;
}

const Section: React.FC<SectionProps> = ({ title, items, isEven }) => (
  <div className={`mb-5 ${isEven ? "text-start" : "text-end"}`}>
    <div
      className="bg-secondary bg-opacity-25 p-4 rounded d-inline-block text-start"
      style={{ maxWidth: "80%" }}
    >
      <h2 className="mb-4 text-center">{title}</h2>
      {items.map((item, index) => (
        <div key={index} className="mb-3">
          <h3 className="h5">{item.title}</h3>
          {item.date && <p className="text-muted">{item.date}</p>}
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const About: React.FC = () => {
  const sections = [
    {
      title: "Education",
      items: [
        {
          title: "Computer Science, XYZ University",
          date: "2018 - 2022",
          description:
            "Bachelor's degree with a focus on software engineering and data structures.",
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "Personal Portfolio Website",
          description:
            "Developed a responsive portfolio website using React and Bootstrap.",
        },
        {
          title: "Task Management App",
          description:
            "Created a full-stack task management application using Node.js and MongoDB.",
        },
      ],
    },
    {
      title: "Experience",
      items: [
        {
          title: "Software Developer, Tech Co.",
          date: "2022 - Present",
          description:
            "Developing and maintaining web applications using React and Node.js.",
        },
        {
          title: "Web Development Intern, Startup Inc.",
          date: "Summer 2021",
          description:
            "Assisted in the development of a new company website and internal tools.",
        },
      ],
    },
    {
      title: "Hobbies",
      items: [
        {
          title: "Photography",
          description:
            "Enjoy capturing landscapes and street scenes in my free time.",
        },
        {
          title: "Hiking",
          description:
            "Love exploring nature trails and challenging myself with different terrains.",
        },
      ],
    },
  ];

  return (
    <div className="d-flex min-vh-100 text-white bg-dark">
      <div
        className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column"
        style={{ width: "90vw" }}
      >
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">About Me</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link active" aria-current="page" to="/about">
                About
              </Link>
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main className="px-3">
          <div className="text-center mb-5">
            <h1 className="mb-4">Hello, I'm Alex</h1>
            <p className="lead">
              I'm a passionate software developer with a love for creating
              innovative solutions and learning new technologies.
            </p>
          </div>

          {sections.map((section, index) => (
            <Section
              key={index}
              title={section.title}
              items={section.items}
              isEven={index % 2 === 0}
            />
          ))}
        </main>

        <footer className="mt-auto text-white-50"></footer>
      </div>
    </div>
  );
};

export default About;
