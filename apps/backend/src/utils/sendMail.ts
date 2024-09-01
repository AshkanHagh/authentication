import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailOption = {
    subject : string; text : string; email : string; html : string;
}

export const sendEmail = async (option : MailOption) : Promise<void> => {
    const transport : nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT || 25, 
        auth : {
            user : process.env.MAIL_USERNAME,
            pass : process.env.MAIL_PASSWORD
        }
    });
    await transport.sendMail({from : process.env.MAIL_SENDER, to : option.email, subject : option.subject, html : option.html});
}