import Link from "next/link";
import React, { useState } from "react";
import useSticky from "../../hooks/useSticky";
import SidebarMenu from "../Sidebar/SidebarMenu";

const Header = () => {
  // handle sidebar show
  const [show, setShow] = useState(false);
  // handle close
  const handleClose = () => setShow(false);
  // handle sidebar show
  const handleShow = () => setShow(true);
  // sticky nav
  const { sticky } = useSticky();

  const categories = [
    "Miscellaneous",
    "Art & Design",
    "Entertainment & Gaming",
    "Search & Discovery",
    "Consulting Services",
    "Programming & Development",
    "Content Creation",
    "Educational Resources",
    "Automation & Bots",
    "Coaching & Self-improvement",
    "Branding & Marketing",
    "Professional Services",
    "Expert Systems",
    "Design & Illustration",
    "Creative Tools",
    "Data Analysis",
    "Law & Governance",
    "Productivity Tools",
    "Product Management",
    "Navigation & Maps",
    "Education & Learning",
    "Advanced Technology",
    "Food & Culinary",
    "Creative Writing",
    "News & Media",
    "Language & Translation",
    "Health & Wellness",
    "Architecture & Construction",
    "SEO & Marketing",
    "Exploration & Research",
    "Astrology & Esoterics",
    "Travel & Geography",
    "Imaging & Photography",
    "Psychology & Social Sciences",
    "Science & Research",
    "Engineering & Industry",
    "Fashion & Style",
    "Music & Audio",
    "Finance & Economics",
    "Fitness & Sports",
    "Literature & Writing",
    "Technology & Innovation",
  ];
  const chunkSize = 10; // Adjust chunk size based on how many items you want per column
  const categoryChunks = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    categoryChunks.push(categories.slice(i, i + chunkSize));
  }
  return (
    <>
      <header>
        <div
          className={
            sticky
              ? "sticky header__area header__shadow-2 white-bg"
              : "header__area header__shadow-2 white-bg"
          }
          id="header-sticky"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-6">
                <div className="logo">
                  <Link href="/">
                    <a>
                      <img
                        src="/assets/img/logo/HD.png"
                        alt="logo"
                        height="100"
                        width="100"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-8 d-none d-lg-block">
                <div className="main-menu d-flex justify-content-end">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="active">
                        <Link href="/">
                          <a>Home</a>
                        </Link>
                      </li>

                      <li>
                        <Link href="/about">
                          <a>About</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy">
                          <a>Privacy</a>
                        </Link>
                      </li>

                      <li>
                        <Link href="/contact">
                          <a>Contact</a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-2 col-md-8 col-6">
                <div className="header__action d-flex align-items-center justify-content-end">
                  <div className="sidebar__menu d-lg-none" onClick={handleShow}>
                    <div className="sidebar-toggle-btn" id="sidebar-toggle">
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SidebarMenu show={show} handleClose={handleClose} />
    </>
  );
};

export default Header;
