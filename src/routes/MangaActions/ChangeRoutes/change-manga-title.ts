import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeMangaTitleRoute = new Elysia().put("/change-title", async ({ body }) => {
    try {
        const manga = await prisma.manga.findUnique({
            where: { id: body.mangaId }
        });
        if (!manga) return { message: "Manga not found", status: 404 };
        const updatedManga = await prisma.manga.update({
            where: { id: body.mangaId },
            data: { title: body.newTitle }
        });
        console.log("Manga title updated with: ", body);
        return { message: "Manga title updated successfully", manga: updatedManga };
    }
    catch (error) {
        console.error("Error updating manga title:", error);
        return { message: "Error updating manga title", status: 500 };
    }
},{
    body: z.object({
        mangaId: z.string(),
        newTitle: z.string()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Change the title of a manga",
        description: "This endpoint allows users to change the title of a manga by providing the manga ID and the new title.",
    }
}
)