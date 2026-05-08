import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeMangaDescriptionRoute = new Elysia().put("/change-description", async ({ body }) => {
    try {
        const manga = await prisma.manga.findUnique({
            where: { id: body.mangaId }
        });
        if (!manga) return { message: "Manga not found", status: 404 };
        const updatedManga = await prisma.manga.update({
            where: { id: body.mangaId },
            data: { description: body.newDescription }
        });
        console.log("Manga description updated with: ", body);
        return { message: "Manga description updated successfully", manga: updatedManga };
    }
    catch (error) {
        console.error("Error updating manga description:", error);
        return { message: "Error updating manga description", status: 500 };
    }
},{
    body: z.object({
        mangaId: z.string(),
        newDescription: z.string()
    }),
    detail: {   
        tags: ["Manga Management"],
        summary: "Change the description of a manga",
        description: "This endpoint allows users to change the description of a manga by providing the manga ID and the new description.",
    }
}
)