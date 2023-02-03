import nodemailer from 'nodemailer';

const EmailVerificationTemplate = (email: any, code: number): void => {
  //const name = fullname.split(' ')[0]
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gnqnpn@gmail.com',
      pass: 'aweqmzalsttwivfg',
    },
  });

  var mailOptions = {
    from: 'helo@eslo.com',
    to: email,
    //bcc: "",
    subject: `Eslo email verification`,
    html: `<html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></script>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        
         <style>
             #email-body {
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 flex-direction: column;
                 font-family: 'Roboto', sans-serif;
                 color: #111;
             }
             
             .header-wrap {
                 margin-top: 50px;
             }
              .email-content {
                 margin-top: 50px;
                 text-align: center;
                 width: 70%;
             }
             
              .email-content h1 {
                 font-size: 18px;
                 text-align: center;
                 margin-bottom:30px;
             }
             .email-content p {
                 font-size: 14px;
                 color: #444;
                 margin: 5px;
             }
             .email-content :nth-child(3) {
                 font-size: 14px;
                 color: #666;
                 margin: 10px;
                 text-align: left;
             }
             #verify-code {
                 font-weight: 600;
                 font-size: 30px;
                  color: #111;
                 
             }
             hr {
                 border: 1px solid #f3f3f4;
                 margin-top: 80px;
             }
             .footer {
                 width: 70%;
                 text-align: center;
             }
             
             .footer p {
                 color: #999;
                 font-size: 12px;
             }
        
         </style>
         
        </head>
        <body>
           <div id="email-body">
               <div class="header-wrap">
                   <img src="https://iili.io/HHJ0crv.jpg" style="width: 100px; margin-top: 10px;">
               </div>
               <div class="email-content">
                   <h1>Email verification code</h1>
                   <p>Your verification code：<span id="verify-code">${code}</span></p>
                   <p>Your verification code will expire in 10 minutes. Please do not share this code with anyone.</p>
                   <hr></hr>
                   
               </div>
        
               <div class="footer">
                   <p>Thank you for choosing Eslo! </p>   
                    <div class="socials">
                        <a> <span class="iconify" data-icon="entypo-social:facebook-with-circle"></span></a>
                        <a> <span class="iconify" data-icon="entypo-social:twitter-with-circle"></span></a>
                        <a> <span class="iconify" data-icon="ant-design:instagram-filled"></span></a>
                        <a> <span class="iconify" data-icon="fa-brands:telegram"></span></a>
                    </div>                 
               </div>
           </div>
        </body>
        </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending mail ' + info.response);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { EmailVerificationTemplate };
