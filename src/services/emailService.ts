// import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses"
// const ses = new SESClient({region:'ap-south-1'});
require('dotenv').config();
var nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bughunter.serve@gmail.com",
      pass: "buqwfwnsfsdrgmcx",
    },
  });

  


// function createSendEmailCommand(toAddresses : string, fromAddress: string, message: string) {



   
    
    
    
     


// // return new SendEmailCommand({
// //     Destination: {
// //         ToAddresses: [toAddresses],
// //     },
// //     Source: fromAddress,
// //     Message: {
// //         Subject: {
// //             Charset: 'UTF-8',
// //             Data: 'Your one time password (OTP)',
// //         },
// //         Body: {
// //             Text: {
// //                 Charset: 'UTF-8',
// //                 Data: message,
// //             },
// //         },
      
// //     },
// // })


// }


export async function sendEmailToken(email: string, Token: string) {

    const message = `Your one time password (OTP) is ${Token}`;
    // const command = createSendEmailCommand(email, process.env.EMAIL_FROM!,message );
    try{
        var mailOptions = {
            from: "bughunter.serve@gmail.com",
            to: email,
            subject: "your one time password (OTP)",
            text: message,
          };

       await transporter.sendMail(mailOptions, function (error : any, info : any) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
    }
    catch(error){
        console.log({message: "can not send email" , error});
    }
}









