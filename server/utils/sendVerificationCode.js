import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmails.js";
export async function sendVerificationCode(verificationCode,email, res){
   try {

    const message = generateVerificationOtpEmailTemplate(verificationCode);
    sendEmail({
        email,
        subject:"Verfication Code (Bookworm Library Management System)",
        message,
    });
    res.status(200).json({
        sucess: true,
        message:"Verification code sent successfully.",
    });
   } catch(error){
    return res.status(500).json ({
        sucess:false,
        message:"verification code failed to send",
    });
   }

}