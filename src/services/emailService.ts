import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses"
require('dotenv').config();
const ses = new SESClient({region:'ap-south-1'});




function createSendEmailCommand(toAddresses : string, fromAddress: string, message: string) {
return new SendEmailCommand({
    Destination: {
        ToAddresses: [toAddresses],
    },
    Source: fromAddress,
    Message: {
        Subject: {
            Charset: 'UTF-8',
            Data: 'Your one time password (OTP)',
        },
        Body: {
            Text: {
                Charset: 'UTF-8',
                Data: message,
            },
        },
      
    },
})
}


export async function sendEmailToken(email: string, Token: string) {

    const message = `Your one time password (OTP) is ${Token}`;
    const command = createSendEmailCommand(email, process.env.EMAIL_FROM!,message );
    try{
        await ses.send(command)
    }
    catch(error){
        console.log({message: "can not send email" , error});
    }
}

