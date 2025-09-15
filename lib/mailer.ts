import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client"; // si tu veux typer les votes

type VoteWithRelations = Prisma.VoteGetPayload<{
  include: {
    resolution: { select: { id: true; title: true } };
    choice: { select: { id: true; title: true } };
  };
}>;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true si 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(
  ownerEmail: string,
  assemblyTitle: string,
  createdVotes: VoteWithRelations[]
) {
  //  const summaryHtml = resolutions
  //    .map((res) => {
  //      const chosen = res.choices.find((c) => c.id === Number(choices[res.id]));
  //      return `<li><b>${res.title}</b> → ${chosen?.title ?? "Non renseigné"}</li>`;
  //    })
  //    .join("");
  //
  //  const subject = `Confirmation de votre vote – ${assembly.title}`;
  //  const html = `
  //    <h2>Vos votes ont été enregistrés ✅</h2>
  //    <p>Bonjour ${dbToken.owner.name},</p>
  //    <p>Le système de vote du <b>${assembly.title}</b> vous confirme que vos choix ont bien été pris en compte.</p>
  //    <ul>${summaryHtml}</ul>
  //    <p>Merci de votre participation.</p>
  //  `;
  const subject = `noreply: Confirmation de vos votes - ${assemblyTitle}`;

  const htmlContent = `
    <p>Bonjour,</p>
    <p>Nous confirmons la prise en compte de vos votes pour l’Assemblée : <b>${assemblyTitle}</b>.</p>
    <ul>
      ${createdVotes
        .map((v) => `<li><b>${v.resolution.title}</b> → choix ${v.choice.title}</li>`)
        .join("")}
    </ul>
    <p>Merci pour votre participation.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: ownerEmail,
    subject,
    html: htmlContent,
  });
}
