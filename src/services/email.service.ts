const sgMail = require("@sendgrid/mail") 
import Config from "../utils/config"
sgMail.setApiKey(Config.sendgridKey);

const sendEmail = async (emailObject : Record<string,any>) => {
  try {
    const { subject, content, to } = emailObject

    const msg = {
      to: "jadeyemo002@gmail.com",
      from: "jaysonkedylove@gmail.com",
      subject,
      html: content
    };

    await sgMail.send(msg)
    console.log('Email sent')

  } catch (err: any) {
    console.log("Mail sender failed")

    if (err.response) {
      console.log(err.response.body)
    }
  }
};
  
export default sendEmail;