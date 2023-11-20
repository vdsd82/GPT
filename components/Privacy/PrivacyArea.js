import React from "react";
import {
  PRIVACY_POLICY_TITLE,
  PRIVACY_POLICY_INTRODUCTION,
  INFORMATION_COLLECTION,
  INFORMATION_USAGE,
  INFORMATION_SHARING,
  USER_RIGHTS,
  DATA_STORAGE_AND_SECURITY,
  POLICY_UPDATES,
  // Add any additional constants you wish to include here
} from "../common/privacyconstant"; // Update this path to where your privacyconstants file is located

const PrivacyArea = () => {
  return (
    <>
      <section className="about__area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xxl-10 offset-xxl-1 col-xl-10 offset-xl-1">
              <div className="about__wrapper">
                <span className="about__title pb-20">
                  {PRIVACY_POLICY_TITLE}
                </span>
                <div className="about__content">
                  <p className="about__text">{PRIVACY_POLICY_INTRODUCTION}</p>
                  <p className="about__text">{INFORMATION_COLLECTION}</p>
                  <p className="about__text">{INFORMATION_USAGE}</p>
                  <p className="about__text">{INFORMATION_SHARING}</p>
                  <p className="about__text">{USER_RIGHTS}</p>
                  <p className="about__text">{DATA_STORAGE_AND_SECURITY}</p>
                  <p className="about__text">{POLICY_UPDATES}</p>
                  {/* If you have additional sections in your privacy policy, add them here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyArea;
