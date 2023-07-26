const sgMail = require("@sendgrid/mail");
require("dotenv");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function emailSender(to, from, subject, html) {
  const msg = {
    to: to, // Change to your recipient
    from: "hafizameerhamza87@gmail.com", // Change to your verified sender
    subject: subject,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return;
    })
    .catch((error) => {
      console.error("errors=>", error.response.body.errors);
    });
  return;
}
module.exports = {
  emailSender,
};
