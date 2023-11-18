import React from "react";
import { DESCRIPTION } from "../common/constants";

const HomeThreeHeroArea = () => {
  return (
    <>
      <section
        className="hero__area hero__height hero__height-2 grey-bg-3 d-flex align-items-center"
        style={{
          background: `url(assets/img/hero/sl-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-9 col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="hero__content hero__content-white text-center">
                <h2 className="hero__title">Discover Third Party GPTs</h2>
                <p>{DESCRIPTION}</p>
                <div className="hero__search">
                  <form action="#">
                    <div className="hero__search-inner hero__search-3 d-md-flex align-items-center">
                      <div className="hero__search-input">
                        <span>
                          <i className="far fa-search"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Search for blog or calculator"
                        />
                      </div>
                      <button type="submit" className="m-btn ml-20">
                        {" "}
                        <span></span> search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeThreeHeroArea;
