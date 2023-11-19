import React, { useState } from "react";

const ContactArea = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    website: "",
    message: "",
  });

  // Handles form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.companyName,
          website: formData.website,
          message: formData.message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Message sent successfully!");
        // Reset form state if needed
        setFormData({
          name: "",
          email: "",
          companyName: "",
          website: "",
          message: "",
        });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message.");
    }
  };

  return (
    <section className="contact__area pt-105 pb-145">
      <div className="contact__shape">
        <img className="circle" src="assets/img/icon/sign/circle.png" alt="" />
        <img className="zigzag" src="assets/img/icon/sign/zigzag.png" alt="" />
        <img className="dot" src="assets/img/icon/sign/dot.png" alt="" />
        <img className="bg" src="assets/img/icon/sign/sign-up.png" alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="page__title-wrapper mb-55">
              <h2 className="page__title-2">Leave Us a Message.</h2>
              <p>We love to hear from you</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xxl-7 col-xl-7"></div>
          <div className="contact__wrapper white-bg">
            <div className="contact__form">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                    <div className="contact__input-wrapper mb-25">
                      <h5>Full Name</h5>
                      <div className="contact__input">
                        <input
                          required
                          type="text"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        <i className="fal fa-user"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                    <div className="contact__input-wrapper mb-25">
                      <h5>Work Email</h5>
                      <div className="contact__input">
                        <input
                          required
                          type="email"
                          placeholder="Enter your work email address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <i className="fal fa-envelope"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                    <div className="contact__input-wrapper mb-25">
                      <h5>Company Name</h5>
                      <div className="contact__input">
                        <input
                          required
                          type="text"
                          placeholder="Enter your company name"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                        />
                        <i className="fal fa-building"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                    <div className="contact__input-wrapper mb-25">
                      <h5>Website</h5>
                      <div className="contact__input">
                        <input
                          required
                          type="text"
                          placeholder="Enter your website URL"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                        />
                        <i className="fal fa-globe"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12">
                    <div className="contact__input-wrapper mb-25">
                      <h5>Message</h5>
                      <div className="contact__input textarea">
                        <textarea
                          required
                          placeholder="Write your message here"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                        <i className="fal fa-comment"></i>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="col-xxl-12">
                    <button type="submit" className="m-btn m-btn-4">
                      <span></span> Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactArea;
