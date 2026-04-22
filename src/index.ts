import { Elysia } from "elysia";
import openapi from "@elysiajs/openapi";
import * as z from "zod";
import { SignUpRoute } from "./routes/sign-up";
import { SignInRoute } from "./routes/sign-in";
import { AddMangaRoute } from "./routes/add-manga";
import { UploadImageRoute } from "./routes/upload-image";
import PrismaClient from "@prisma/client";
export const prisma  = new PrismaClient.PrismaClient();

const app = new Elysia().use(openapi({
  mapJsonSchema: {
    zod: z.toJSONSchema
  },
  documentation: {
    tags: [
      {name: "Authentication", description: "Endpoints related to user authentication"}
    ]
  }
}))
.use(SignUpRoute)
.use(SignInRoute)
.use(AddMangaRoute)
.use(UploadImageRoute)
.listen(3000);

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
