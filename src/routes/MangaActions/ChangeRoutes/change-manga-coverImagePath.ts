import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeMangaCoverImagePathRoute = new Elysia().put("/change-cover-image-path", async ({ body }) => {
    try {
        const manga = await prisma.manga.findUnique({
            where: { id: body.mangaId }
        });
        if (!manga) return { message: "Manga not found", status: 404 };
        const updatedManga = await prisma.manga.update({
            where: { id: body.mangaId },
            data: { coverImagePath: body.newCoverImagePath }
        });
        console.log("Manga cover image path updated with: ", body);
        return { message: "Manga cover image path updated successfully", manga: updatedManga };
    } catch (error) {
        console.error("Error updating manga cover image path:", error);
        return { message: "Error updating manga cover image path", status: 500 };
    }
},{
    body: z.object({
        mangaId: z.string(),
        newCoverImagePath: z.string()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Change the cover image path of a manga",
        description: "This endpoint allows users to change the cover image path of a manga by providing the manga ID and the new cover image path.",
    }
}
)