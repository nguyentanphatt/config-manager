"use server";
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    return token.value;
  }

  console.log("No token");
  return null;
}
