import Elysia from "elysia";
import z from "zod";

export const AddMangaRoute = new Elysia().post("/add-manga", ({body}) => {
  console.log("Manga added with: ", body);
  return { message: "Manga added successfully" };
},{
  body: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string().array(),
    publishedYear: z.number().int(),

  })
}
 )