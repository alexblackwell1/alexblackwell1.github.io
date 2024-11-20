import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

import "../css/cover.css";
import Header from "../components/Header";

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

const Section: React.FC<SectionProps> = ({ title, items, isEven }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`mb-5 ${isEven ? "text-start" : "text-end"} ${
        isVisible ? "fade-in" : "fade-out"
      }`}
    >
      <div
        className="bg-secondary bg-opacity-25 p-4 rounded d-inline-block text-start"
        style={{ width: "50%", maxWidth: "80%" }}
      >
        <h2 className="mb-4 text-center">{title}</h2>
        {items.map((item, index) => (
          <div key={index} className="mb-3">
            <h3 className="h5">{item.title}</h3>
            {item.date && <p className="text-info mb-0">{item.date}</p>}
            <p>{item.description}</p>
            {index < items.length - 1 && <br />}
          </div>
        ))}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const sections = [
    {
      title: "Education",
      items: [
        {
          title: "Computer Science, App State University",
          date: "2018 - 2022",
          description:
            "Bachelor's degree with minors in Mathematics and Philosophy.",
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "AthleteX",
          description:
            "Lead Front and Back-end Developer for startup focusing on tokenizing Athlete performance.",
        },
        {
          title: "Haskell Turing Machine",
          description:
            "Created a Functional Turing Machine that determines if a string is in the language.",
        },
      ],
    },
    {
      title: "Experience",
      items: [
        {
          title: "Full Stack Engineer, Starta",
          date: "2023 - Present",
          description:
            "Developing client requested pages using primarily C# and SQL",
        },
        {
          title: "Technical Support",
          date: "2019 - 2022",
          description:
            "Assisted setup and maintenance of all technology at the university's library",
        },
      ],
    },
    {
      title: "Hobbies",
      items: [
        {
          title: "Board Games",
          description:
            "Enjoy hanging out with friends and beating them with complex strategies... or so is the goal.",
        },
        {
          title: "Hiking",
          description:
            "Love exploring nature trails and challenging myself with different expeditions.",
        },
      ],
    },
  ];

  return (
    <div className="d-flex min-vh-100 text-white bg-dark">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header
          title="About Me"
          currentPage="/about"
          links={[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/wishlists", label: "Wishlists" },
          ]}
        />

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
