import { login } from "./modules/auth/service.js";

async function test() {
  try {
    const result = await login({
      email: "demo.farmer@harithasahayak.in",
      password: "password123"
    });
    console.log("LOGIN SUCCESS:", result);
  } catch (error) {
    console.error("LOGIN FAILED:", error);
  }
}

test();
