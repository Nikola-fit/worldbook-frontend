import { http } from "@/lib/http";

export async function register(payload) {
  const { data } = await http.post("/user/registration", payload);
  return data;
}

export async function login(payload) {
  const { data } = await http.post("/user/api/token/", payload);
  return data;
}
