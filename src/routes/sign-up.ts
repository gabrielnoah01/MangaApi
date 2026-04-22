import Elysia from "elysia";
import z from "zod";

export const SignUpRoute = new Elysia().post("/sign-up", ({body}) => {
  
  console.log("User signed up with:", body);
  return { message: "Sign up successful" };
},{
  body: z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email().optional()
  }),
  detail: {
    tags: ["Authentication"],
    summary: "Sign up for the application",
    description: "This endpoint allows users to sign up for the application by providing their username, password, and optional email.",
  }
})