import emailjs from "emailjs-com";

// Инициализация EmailJS
const EMAILJS_SERVICE_ID = "service_cupozon";
const EMAILJS_TEMPLATE_ID = "template_cupozon";
const EMAILJS_USER_ID = "cupozon_user_id";

export interface EmailData {
  fullName: string;
  contact: string;
  reviewCount: string;
  comment: string;
}

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Подготавливаем данные для отправки
    const templateParams = {
      to_email: "artemasriev777@gmail.com",
      from_name: data.fullName,
      contact: data.contact,
      review_count: data.reviewCount,
      comment: data.comment || "Комментарий не указан",
      message: `
Новая заявка с сайта на отзывы!

ФИО: ${data.fullName}
Контакт: ${data.contact}
Количество отзывов: ${data.reviewCount}
Комментарий: ${data.comment || "Не указан"}

Дата заявки: ${new Date().toLocaleString("ru-RU")}
      `.trim(),
    };

    // Отправляем email через EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID,
    );

    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Функция для инициализации EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_USER_ID);
};
