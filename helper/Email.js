const { SENDGRIB_KEY } = require('../config/key');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(SENDGRIB_KEY);
module.exports = (email, subject, reset) => {
  const msg = {
    to: email,
    from: 'noreplyemail@gmail.com',
    templateId: 'd-87fd4454f0a1480bbdb6bab558fc018b',
    dynamic_template_data: {
      token: reset,
      subject
    }
  };
  sgMail.send(msg);
};
