import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text }) => {
  const { data, error } = await resend.emails.send({
    from: `Dogs API <${process.env.RESEND_FROM_EMAIL}>`,
    to,
    subject,
    text,
  });

  if (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Não foi possível enviar o e-mail.");
  }

  return data;
};
