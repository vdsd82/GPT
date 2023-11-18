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
  // user
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
                      <li className="has-dropdown">
                        <a>Pages</a>
                        <ul className="submenu">
                          <li>
                            <Link href="/about">
                              <a>About</a>
                            </Link>
                          </li>
                          <li>
                            <Link href="/about">
                              <a>Disclaimer</a>
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li className="has-dropdown">
                        <Link href="/gpt">
                          <a>GPT</a>
                        </Link>

                        <ul className="submenu">
                          <li>
                            <Link href="/gpt">
                              <a>GPT</a>
                            </Link>
                          </li>
                          <li>
                            <Link href="/gpt-details">
                              <a>gpt Details</a>
                            </Link>
                          </li>
                        </ul>
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
