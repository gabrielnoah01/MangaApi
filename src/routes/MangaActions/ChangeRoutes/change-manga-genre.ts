import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeMangaGenreRoute = new Elysia().put("/change-genre", async ({ body }) => {
  try {
    const manga = await prisma.manga.findUnique({
        where: { id: body.mangaId }
    });
    if (!manga) return { message: "Manga not found", status: 404 };
    const updatedManga = await prisma.manga.update({
        where: { id: body.mangaId },
        data: { genre: body.newGenre }
    });
    console.log("Manga genre updated with: ", body);
    return { message: "Manga genre updated successfully", manga: updatedManga };
  }
    catch (error) {
        console.error("Error updating manga genre:", error);
        return { message: "Error updating manga genre", status: 500 };
    }
},{
  body: z.object({
    mangaId: z.string(),
    newGenre: z.string().array()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Change the genre of a manga",
        description: "This endpoint allows users to change the genre of a manga by providing the manga ID and the new genre.",
    }
}
)