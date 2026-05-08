import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const SignInRoute = new Elysia().post("/sign-in", async ({body}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })
  if (!user) return { message: "User not found", status: 404 }
  console.log("User signed in with:", body);
  return { message: "Sign in successful" };
},{
  body: z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email()
  }),
  detail: {
    tags: ["Authentication"],
    summary: "Sign in to the application",
    description: "This endpoint allows users to sign in to the application by providing their username and password.",
  }
})