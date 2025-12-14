import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export const getEmailTransporter = async () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    if (process.env.NODE_ENV === 'development') {
      try {
        await transporter.verify();
        console.log('✅ Email server ready');
      } catch (error) {
        console.warn('⚠️ Email server not configured, using Ethereal Mail');
      }
    }
  }
  return transporter;
};

export const sendInvoiceEmail = async (to: string, subject: string, html: string, pdfBuffer?: Buffer) => {
  const transporter = await getEmailTransporter();
  
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"DineFlow AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    ...(pdfBuffer && {
      attachments: [{
        filename: 'invoice.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    })
  };

  return transporter.sendMail(mailOptions);
};















