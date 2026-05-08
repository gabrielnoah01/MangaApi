import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const deleteMangaRoute = new Elysia().delete("/delete-manga", async ({ body }) => {
    try {
        const manga = await prisma.manga.findUnique({
            where: { id: body.mangaId }
        });
        if (!manga) return { message: "Manga not found", status: 404 };
        await prisma.manga.delete({
            where: { id: body.mangaId }
        });
        console.log("Manga deleted with: ", body);
        return { message: "Manga deleted successfully" };
    } catch (error) {
        console.error("Error deleting manga:", error);
        return { message: "Error deleting manga", status: 500 };
    }
},{
    body: z.object({
        mangaId: z.string()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Delete a manga",
        description: "This endpoint allows users to delete a manga from the collection by providing the manga ID.",
    }
}
)