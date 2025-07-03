"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1h, 7d: 24 * 7
  });
}
