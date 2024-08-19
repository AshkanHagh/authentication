import { EventEmitter } from 'node:events';
import { sendEmail } from '../libs/utils/sendMail';

export const emailEvent = new EventEmitter();

emailEvent.on('send-magic-link', async (email : string, magicLink : string) => {
  await sendEmail({
    email,
    subject : 'Activate Your Account with Magic Link',
    text : 'Please use the following link to activate your account: ' + magicLink,
    html : `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background-color: #f4f4f7; padding: 40px; border-radius: 10px;">
        <h2 style="color: #ff6f61; text-align: center; font-size: 26px; margin-bottom: 30px;">Welcome to Our Community</h2>
        <p style="text-align: center; font-size: 18px; color: #555; line-height: 1.6; margin-bottom: 20px;">
          Hi there, we're thrilled to have you here! To complete your sign-up process, simply click the magic link below.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" style="display: inline-block; padding: 15px 30px; font-size: 18px; color: #fff; background-color: #ff6f61; text-decoration: none; border-radius: 30px; transition: background-color 0.3s ease;">
            Activate My Account
          </a>
        </div>
        <p style="text-align: center; font-size: 16px; color: #888; margin-top: 40px;">
          If you didn’t request this, just ignore this email. If you have any questions, feel free to <a href="#" style="color: #ff6f61; text-decoration: none;">contact us</a>.
        </p>
        <p style="text-align: center; font-size: 16px; color: #888; margin-top: 20px;">
          Best regards,<br><strong>Your Support Team</strong>
        </p>
      </div>
    `
  });
});

emailEvent.on('send-activation-code', async (email : string, activationCode : string) => {
  await sendEmail({
    email,
    subject : 'Activate Your Account with Activation Code',
    text : 'Please use the following code to activate your account: ' + activationCode,
    html : `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background-color: #f4f4f7; padding: 40px; border-radius: 10px;">
        <h2 style="color: #ff6f61; text-align: center; font-size: 26px; margin-bottom: 30px;">Welcome to Our Community</h2>
        <p style="text-align: center; font-size: 18px; color: #555; line-height: 1.6; margin-bottom: 20px;">
          Hi there, we're thrilled to have you here! To complete your sign-up process, please use the activation code below.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 18px; color: #fff; background-color: #ff6f61; text-decoration: none; border-radius: 30px; transition: background-color 0.3s ease;">
            ${activationCode}
          </span>
        </div>
        <p style="text-align: center; font-size: 16px; color: #888; margin-top: 40px;">
          If you didn’t request this, just ignore this email. If you have any questions, feel free to <a href="#" style="color: #ff6f61; text-decoration: none;">contact us</a>.
        </p>
        <p style="text-align: center; font-size: 16px; color: #888; margin-top: 20px;">
          Best regards,<br><strong>Your Support Team</strong>
        </p>
      </div>
    `
  });
});
