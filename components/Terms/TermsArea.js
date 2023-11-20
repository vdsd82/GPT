import React from "react";
import {
  TERMS_OF_SERVICE_TITLE,
  ACCEPTANCE_OF_TERMS,
  DESCRIPTION_OF_SERVICE,
  USER_OBLIGATIONS,
  INTELLECTUAL_PROPERTY_RIGHTS,
  USER_CONTENT,
  DISCLAIMERS,
  LIMITATION_OF_LIABILITY,
  TERMINATION,
  GOVERNING_LAW,
  CHANGES_TO_TERMS,
  CONTACT_INFORMATION,
  // Add any additional constants you wish to include here
} from "../common/termconstants"; // Update this path to where your termsconstants file is located

const TermsServiceArea = () => {
  return (
    <>
      <section className="about__area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xxl-10 offset-xxl-1 col-xl-10 offset-xl-1">
              <div className="about__wrapper">
                <span className="about__title">{TERMS_OF_SERVICE_TITLE}</span>
                <div className="about__content">
                  <p className="about__text">{ACCEPTANCE_OF_TERMS}</p>
                  <p className="about__text">{DESCRIPTION_OF_SERVICE}</p>
                  <p className="about__text">{USER_OBLIGATIONS}</p>
                  <p className="about__text">{INTELLECTUAL_PROPERTY_RIGHTS}</p>
                  <p className="about__text">{USER_CONTENT}</p>
                  <p className="about__text">{DISCLAIMERS}</p>
                  <p className="about__text">{LIMITATION_OF_LIABILITY}</p>
                  <p className="about__text">{TERMINATION}</p>
                  <p className="about__text">{GOVERNING_LAW}</p>
                  <p className="about__text">{CHANGES_TO_TERMS}</p>
                  <p className="about__text">{CONTACT_INFORMATION}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsServiceArea;
