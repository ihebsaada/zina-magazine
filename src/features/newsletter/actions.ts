"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterActionCode =
  | "success"
  | "duplicate"
  | "missing_email"
  | "invalid_email"
  | "error";

export type ActionState = {
  success: boolean;
  code: NewsletterActionCode;
  message?: string;
  error?: string;
};

export async function subscribeToNewsletter(
  prevState: ActionState | Record<string, never>,
  formData: FormData,
): Promise<ActionState> {
  const rawEmail = formData.get("email");
  const locale = formData.get("locale") === "ar" ? "ar" : "en";

  if (!rawEmail || typeof rawEmail !== "string") {
    return {
      success: false,
      code: "missing_email",
      error: locale === "ar" ? "البريد الإلكتروني مطلوب." : "Email is required.",
    };
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return {
      success: false,
      code: "invalid_email",
      error:
        locale === "ar"
          ? "البريد الإلكتروني غير صالح."
          : "Invalid email address.",
    };
  }

  const insertPayload: TablesInsert<"newsletter"> = {
    email: normalizedEmail,
    locale,
    confirmed: false,
  };

  const supabase = createServerSupabase();

  try {
    const { error } = await supabase.from("newsletter").insert(insertPayload);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[newsletter action]", error);
      }

      if (error.code === "23505") {
        return {
          success: true,
          code: "duplicate",
          message:
            locale === "ar" ? "أنت مشترك بالفعل." : "You're already subscribed.",
        };
      }

      return {
        success: false,
        code: "error",
        error:
          locale === "ar"
            ? "حدث خطأ. حاول مجدداً."
            : "Something went wrong. Please retry.",
      };
    }

    return {
      success: true,
      code: "success",
      message:
        locale === "ar"
          ? "شكراً! تم تسجيلك بنجاح."
          : "Thank you! You're subscribed.",
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[newsletter action unexpected]", err);
    }

    return {
      success: false,
      code: "error",
      error:
        locale === "ar"
          ? "تعذر الاشتراك الآن. حاول مجدداً."
          : "Unable to subscribe right now. Please try again.",
    };
  }
}