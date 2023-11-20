// components/Home/HomeThreeHeroArea.js

import React, { useState } from "react";
import { DESCRIPTION } from "../common/constants";
import Router from "next/router";

const HomeThreeHeroArea = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    Router.push(`/search-results?term=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <>
      <section
        className="hero__area hero__height hero__height-2 grey-bg-3 d-flex align-items-center container-with-badge"
        style={{
          background: `url(assets/img/hero/sl-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=426024&theme=light"
          alt="FindGPTPro - Custom GPT repository | Product Hunt"
          className="product-hunt-badge"
        />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-9 col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="hero__content hero__content-white text-center">
                <h2 className="hero__title">Discover Third Party GPTs</h2>
                <p>{DESCRIPTION}</p>
                <div className="hero__search">
                  <form onSubmit={handleSearch}>
                    <div className="hero__search-inner hero__search-3 d-md-flex align-items-center">
                      <div className="hero__search-input">
                        <span>
                          <i className="far fa-search"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Search for gpt"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="m-btn ml-20">
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
