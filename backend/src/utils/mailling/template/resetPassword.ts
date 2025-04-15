export const resetPasswordTemplate = (name: string, token: string) => {
    return `
        <html>
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007BFF;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            .button:hover {
                background-color: #0056b3;
            }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello ${name},</h1>
                <p>Click the button below to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${token}" class="button">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;
};