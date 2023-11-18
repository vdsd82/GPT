import React, { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../common/Pagination";
import gptSideBar from "./gptSideBar";
import Singlegpt from "./Singlegpt";

const gptArea = ({ posts }) => {
  // all gpts
  const gpts = posts;
  console.log(gpts);
  // current page
  const [currentPage, setCurrentPage] = useState(1);
  // gpt per page
  const [gptPerPage, setgptperPage] = useState(2);
  // index of last page
  const indexOfLastPage = currentPage * gptPerPage;
  // index of first page
  const indexOfFirstPage = indexOfLastPage - gptPerPage;
  // currentgpts
  const currentgpts = gpts.slice(indexOfFirstPage, indexOfLastPage);
  // paginate
  const paginate = (number) => {
    setCurrentPage(number);
  };

  return (
    <>
      <section className="postbox__area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8">
              <div className="postbox__wrapper">
                {currentgpts.map((gpt) => (
                  <Singlegpt key={gpt.title} gpt={gpt} />
                ))}

                <Pagination
                  productPerPage={gptPerPage}
                  totalProduct={gpts.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            </div>

            <gptSideBar post={gpts} />
          </div>
        </div>
      </section>
    </>
  );
};

export default gptArea;
