import React from "react";
import {
  About_matter1,
  About_matter2,
  About_matter3,
} from "../common/constants";

const AboutArea = () => {
  return (
    <>
      <section className="about__area pt-100">
        <div className="container">
          <div className="row">
            <div className="col-xxl-10 offset-xxl-1 col-xl-10 offset-xl-1">
              <div className="about__wrapper">
                <span className="about__title">About FindGPTPro</span>
                <h3 className="about__sub-title">
                  We are enabling you to find useful GPTs
                </h3>
                <div
                  className="about__thumb w-img wow fadeInUp"
                  data-wow-delay=".3s"
                >
                  <img src="assets/img/about/about-1.jpg" alt="" />
                </div>
                <div
                  className="about__count pt-50 pb-15 wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="row">
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="about__count-item text-center launche mb-30">
                        <p>LAUNCHED IN</p>
                        <h4>
                          <span className="counter">2023</span>
                        </h4>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="about__count-item text-center community mb-30">
                        <p>Users Served</p>
                        <h4>
                          <span className="counter">1000+</span>+
                        </h4>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="about__count-item text-center mission mb-30">
                        <p>GPTs Available</p>
                        <h4>
                          <span className="counter">10k+</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about__content">
                  <p className="about__text">{About_matter1}</p>
                  <p className="about__text">{About_matter2}</p>
                  <p className="about__text">{About_matter3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutArea;
