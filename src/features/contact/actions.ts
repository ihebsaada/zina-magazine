"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactActionState = {
  success: boolean;
  message?: string;
  error?: string;
  fields?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
};

export async function submitContactMessage(
  prevState: ContactActionState | Record<string, never>,
  formData: FormData
): Promise<ContactActionState> {
  const locale = formData.get("locale") === "ar" ? "ar" : "en";
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const subject = formData.get("subject")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  const fields = { name, email, subject, message };

  // Validations
  if (!name.trim()) {
    return {
      success: false,
      error: locale === "ar" ? "الاسم مطلوب." : "Name is required.",
      fields,
    };
  }
  if (name.length > 80) {
    return {
      success: false,
      error: locale === "ar" ? "الاسم يجب ألا يتجاوز 80 حرفاً." : "Name must not exceed 80 characters.",
      fields,
    };
  }

  if (!email.trim()) {
    return {
      success: false,
      error: locale === "ar" ? "البريد الإلكتروني مطلوب." : "Email is required.",
      fields,
    };
  }
  if (!EMAIL_RE.test(email.trim().toLowerCase())) {
    return {
      success: false,
      error: locale === "ar" ? "البريد الإلكتروني غير صالح." : "Invalid email address.",
      fields,
    };
  }

  if (subject && subject.length > 120) {
    return {
      success: false,
      error: locale === "ar" ? "الموضوع يجب ألا يتجاوز 120 حرفاً." : "Subject must not exceed 120 characters.",
      fields,
    };
  }

  if (!message.trim()) {
    return {
      success: false,
      error: locale === "ar" ? "الرسالة مطلوبة." : "Message is required.",
      fields,
    };
  }
  if (message.length > 2000) {
    return {
      success: false,
      error: locale === "ar" ? "الرسالة يجب ألا تتجاوز 2000 حرف." : "Message must not exceed 2000 characters.",
      fields,
    };
  }

  const supabase = createServerSupabase();

  const insertPayload: TablesInsert<"contact_messages"> = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim() || null,
    message: message.trim(),
    locale,
    is_read: false,
  };

  try {
    const { error } = await supabase.from("contact_messages").insert(insertPayload);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[contact action]", error);
      }
      return {
        success: false,
        error: locale === "ar" ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Unable to send message. Please try again.",
        fields,
      };
    }

    return {
      success: true,
      message: locale === "ar" ? "تم إرسال رسالتك. شكراً لتواصلك مع ZINA." : "Message sent. Thank you for contacting ZINA.",
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[contact action unexpected]", err);
    }
    return {
      success: false,
      error: locale === "ar" ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Unable to send message. Please try again.",
      fields,
    };
  }
}
