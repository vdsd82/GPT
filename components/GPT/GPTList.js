import React from "react";
import Link from "next/link";

const GPTCard = ({ gpt }) => {
  return (
    <div className="col-xl-4 col-lg-4 col-md-6">
      <div className="latest-gpt mb-30">
        <div className="latest-gpt-img pos-rel">
          {gpt.Picture && (
            <img src={gpt.Picture} alt={gpt.Title || "GPT image"} />
          )}
        </div>
        <div className="latest-gpt-content">
          <div className="latest-post-meta mb-15">
            {gpt.Author && gpt.Author.Name && (
              <span>
                <Link
                  href="/gpt-details/[slug]"
                  as={`/gpt-details/${gpt.web_id}`}
                >
                  <a>{gpt.Author.Name}</a>
                </Link>
              </span>
            )}
            {gpt.UpdatedTime && (
              <span>
                <Link
                  href="/gpt-details/[slug]"
                  as={`/gpt-details/${gpt.web_id}`}
                >
                  {gpt.UpdatedTime}
                </Link>
              </span>
            )}
          </div>
          <h3 className="latest-gpt-title">
            <Link href="/gpt-details/[slug]" as={`/gpt-details/${gpt.web_id}`}>
              <a>{gpt.Title}</a>
            </Link>
          </h3>
          <p>{gpt.Description || "No description available."}</p>
          <p>Category: {gpt.Category}</p>
          <div className="gpt-arrow">
            <Link href="/gpt-details/[slug]" as={`/gpt-details/${gpt.web_id}`}>
              <a>Read More</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const GPTList = ({ gpts }) => {
  return (
    <div className="latest-news-area pt-120 pb-90">
      <div className="container">
        <div className="row">
          {gpts.map((gpt, index) => (
            <GPTCard key={index} gpt={gpt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GPTList;
