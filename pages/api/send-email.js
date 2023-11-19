// pages/api/send-email.js

import nodemailer from "nodemailer";

// Helper method to set CORS headers
const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // or the specific origin you want to allow
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(res);

  // Return method not allowed if not a POST request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { name, email, message, company, website } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Contact Form" <info@justticks.in>',
      to: "info@justticks.in",
      subject: "New Contact Form Submission GPT",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nCompany: ${company}\nWebsite: ${website}`,
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, error: error.message });
  }
}
