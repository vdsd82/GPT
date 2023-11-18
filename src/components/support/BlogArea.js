import React from "react";
import Singlegpt from "./Singlegpt";

const gptArea = () => {
  return (
    <>
      <section className="gpt__area pt-105 pb-110">
        <div className="container">
          <div className="row">
            <div className="col-xxl-11 offset-xxl-1">
              <div className="section__title-wrapper mb-65">
                <h2 className="section__title">Latest gpt</h2>
                <p>A load of old tosh the full monty sloshed pukka squiffy.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-11 offset-xxl-1 col-xl-11">
              <div className="row">
                <div
                  className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay=".3s"
                >
                  <Singlegpt title="He lost his bottle hanky panky that super mufty spiffing bobby pardon me geeza lemon." />

                  <Singlegpt title="Oxford super are you taking the piss me old mucker boot owt to do with me the bee's knees." />

                  <Singlegpt title="David, it's your round wellies sloshed only a quid bubble and squeak mufty chap." />

                  <Singlegpt title="Jeffrey faff about A bit of how's your father he lost his bottle, butty cras skive off I give." />
                </div>

                <div
                  className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay=".7s"
                >
                  <Singlegpt title="Jeffrey faff about A bit of how's your father he lost his bottle, butty cras skive off I give." />

                  <Singlegpt title="Lurgy don't get shirty with me blower posh porkies spend a penny tickety boo mufty ." />

                  <Singlegpt title="He lost his bottle hanky panky that super mufty spiffing bobby pardon me geeza lemon." />

                  <Singlegpt title="Oxford super are you taking the piss me old mucker boot owt to do with me the bee's knees." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default gptArea;
