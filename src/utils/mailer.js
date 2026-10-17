const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

module.exports = {
    sendResetPassword: async (email, nome, token) => {
        const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Recuperação de senha',
            text: `Olá, ${nome}. Use o link para redefinir sua senha (válido por 30 minutos): ` +
                `${link}\n\nSe não foi você, ignore este e-mail.`,
        });
    },
};