import Elysia from "elysia";
import z from "zod";

export const SignInRoute = new Elysia().get("/sign-in", ({body}) => {
  console.log("User signed in with:", body);
  return { message: "Sign in successful" };
},{
  body: z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email().optional()
  }),
  detail: {
    tags: ["Authentication"],
    summary: "Sign in to the application",
    description: "This endpoint allows users to sign in to the application by providing their username and password.",
  }
})