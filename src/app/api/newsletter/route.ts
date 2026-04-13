/**
 * api/newsletter/route.ts
 *
 * POST {email, locale} → inscrire un email à la newsletter
 */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import type { TablesInsert } from "@/lib/supabase/types";

// Validation email simple
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterBody = {
  email?: string;
  locale?: string;
};

function normalizeLocale(value?: string): "en" | "ar" {
  return value === "ar" ? "ar" : "en";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as NewsletterBody;
  const rawEmail = body.email;
  const locale = normalizeLocale(body.locale);

  if (!rawEmail || typeof rawEmail !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 422 },
    );
  }

  const insertPayload: TablesInsert<"newsletter"> = {
    email: normalizedEmail,
    locale,
    confirmed: false,
  };

  const { error } = await supabase.from("newsletter").insert(insertPayload);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
