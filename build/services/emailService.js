"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
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
function sendEmailToken(email, Token) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = `Your one time password (OTP) is ${Token}`;
        // const command = createSendEmailCommand(email, process.env.EMAIL_FROM!,message );
        try {
            var mailOptions = {
                from: "bughunter.serve@gmail.com",
                to: email,
                subject: "your one time password (OTP)",
                text: message,
            };
            yield transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent: " + info.response);
                }
            });
        }
        catch (error) {
            console.log({ message: "can not send email", error });
        }
    });
}
exports.sendEmailToken = sendEmailToken;
