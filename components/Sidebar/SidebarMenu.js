import Link from "next/link";
import React from "react";
import { Offcanvas } from "react-bootstrap";
import Collapsible from "react-collapsible";

const SidebarMenu = ({ show, handleClose }) => {
  return (
    <>
      <div>
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          className="side__bar"
        >
          <Offcanvas.Header closeButton>
            <div className="logo">
              <Link href="/home">
                <a>
                  <img src="assets/img/logo/HD.png" alt="logo" />
                </a>
              </Link>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <div className="">
              <div className="">
                <div className="sidebar__content">
                  <div className="mobile-menu">
                    <nav id="mobile-menu">
                      <ul>
                        <div className="single_link iconAdd ">
                          <li>
                            <Link href="/">
                              <a>Home</a>
                            </Link>
                          </li>
                        </div>
                        <div className="single_link iconAdd border-0">
                          <li>
                            <Link href="/about">
                              <a>About</a>
                            </Link>
                          </li>
                        </div>

                        <div className="single_link iconAdd border-0">
                          <li>
                            <Link href="/contact">
                              <a>Contact</a>
                            </Link>
                          </li>
                        </div>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default SidebarMenu;
