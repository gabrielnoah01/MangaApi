import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const SignUpRoute = new Elysia().post("/sign-up", async ({body}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });
  const author = await prisma.author.findUnique({
    where: {
      userEmail: body.email
    }
  });
  if (user || author) return { message: "User already exists", status: 409 };
  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      password: body.password,
      email: body.email,
      author: { 
        create: {
          name: body.name,
          userEmail: body.email,
          slug: body.name.toLowerCase().replace(/\s+/g, "-")
        }
      }
    },
  });

  console.log("User signed up with:", body);
  if (!newUser) return { message: "Error creating user", status: 500 };
  if (newUser) {
    console.log("New user created:", newUser);
    return { message: "Sign up successful", user: newUser };
  }
},{
  body: z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email()
  }),
  detail: {
    tags: ["Authentication"],
    summary: "Sign up for the application",
    description: "This endpoint allows users to sign up for the application by providing their name, password, and email.",
  }
})