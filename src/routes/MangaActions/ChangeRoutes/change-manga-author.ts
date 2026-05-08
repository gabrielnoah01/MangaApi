import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeMangaAuthorRoute = new Elysia().put("/change-author", async ({ body }) => {
    try {
        const manga = await prisma.manga.findUnique({
            where: { id: body.mangaId }
        });
        if (!manga) return { message: "Manga not found", status: 404 };
        const updatedManga = await prisma.manga.update({
            where: { id: body.mangaId },
            data: { authorId: body.newAuthor }
        });
        console.log("Manga author updated with: ", body);
        return { message: "Manga author updated successfully", manga: updatedManga };
    }
    catch (error) {
        console.error("Error updating manga author:", error);
        return { message: "Error updating manga author", status: 500 };
    }
},{
    body: z.object({
        mangaId: z.string(),
        newAuthor: z.string()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Change the author of a manga",
        description: "This endpoint allows users to change the author of a manga by providing the manga ID and the new author.",
    }
}
)