import Link from "next/link";
import React from "react";

const Singlegpt = ({ title }) => {
  return (
    <>
      <div className="gpt__item mb-35">
        <p className="gpt__text">
          <Link href="gpt-details">
            <a>{title}</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Singlegpt;
