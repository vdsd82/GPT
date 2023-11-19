import React, { useEffect, useState } from "react";
import Link from "next/link";

const HomeThreeGPT = ({ searchTermObj }) => {
  // If the prop is actually an object

  const [gpts, setgpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("test", searchTermObj);
  useEffect(() => {
    async function fetchRandomDocuments() {
      if (!searchTermObj) return;
      // const searchTerm = searchTermObj.searchTerm;
      console.log(
        `/api/random-document?searchTerm=${encodeURIComponent(searchTermObj)}`
      );
      try {
        const response = await fetch(
          `api/random-document?searchTerm=${encodeURIComponent(searchTermObj)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter out any "Not found" fields
        const filteredData = data.map((doc) => {
          Object.keys(doc).forEach((key) => {
            if (doc[key] === "Not found") {
              doc[key] = ""; // Replace "Not found" with an empty string
            } else if (typeof doc[key] === "object" && doc[key] !== null) {
              // Recursively sanitize nested objects
              Object.keys(doc[key]).forEach((nestedKey) => {
                if (doc[key][nestedKey] === "Not found") {
                  doc[key][nestedKey] = "";
                }
              });
            }
          });
          return doc;
        });
        setgpts(filteredData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomDocuments();
  }, [searchTermObj]); // Add searchTerm as a dependency for useEffect

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="latest-news-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="section__title-wrapper text-center mb-60">
                <h2 className="section__title">
                  Search Results for {searchTermObj}
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {gpts.map((gpt, index) => (
              <div key={index} className="col-xl-4 col-lg-4 col-md-6">
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
                      <Link
                        href="/gpt-details/[slug]"
                        as={`/gpt-details/${gpt.web_id}`}
                      >
                        <a>{gpt.Title}</a>
                      </Link>
                    </h3>
                    <p>{gpt.Description || "No description available."}</p>
                    <p> Category: {gpt.Category}</p>
                    <div className="gpt-arrow">
                      <Link
                        href="/gpt-details/[slug]"
                        as={`/gpt-details/${gpt.web_id}`}
                      >
                        <a>Read More</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeThreeGPT;
