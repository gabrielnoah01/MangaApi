import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";
import { id } from "zod/v4/locales";

export const AddMangaRoute = new Elysia().post("/add-manga", async ({body}) => {

try {
  const user = await prisma.user.findUnique({
  where: { id: body.createdById }
});

if (!user) {
  return { message: "User not found", status: 404 };
}
 const manga = await prisma.manga.findUnique({
    where: {
      title: body.title
    }
  });
if (manga) return { message: "Manga already exists", status: 409 };
  const newManga = await prisma.manga.create({
    data: {
      title: body.title,
      publishedYear: body.publishedYear,
      authorId: body.authorId,
      genre: body.genre,
      createdById: body.createdById
    }
  });
  console.log("Manga added with: ", body);
  return { message: "Manga added successfully", manga: newManga };
}catch (error) {
  console.error("Error finding user:", error);
  return { message: "Error finding user", status: 500 };
}
 
  
},{
  body: z.object({
    title: z.string(),
    authorId: z.string(),
    genre: z.string().array(),
    publishedYear: z.number().int(),
    createdById: z.string()

  }),
  detail: {
    tags: ["Manga Management"],
    summary: "Add a new manga to the collection",
    description: "This endpoint allows users to add a new manga to the collection by providing the title, author, genre, published year, and the ID of the user adding the manga.",
  }
}
 )