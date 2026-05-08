import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const findChapterRoute = new Elysia().get("/find-chapter", async ({ query }) => {
    try {
        const chapter = await prisma.chapter.findUnique({
            where: {
                number: query.number
            }
        });
        if (!chapter) return { message: "Chapter not found", status: 404 };
        return { message: "Chapter found successfully", chapter };
    }
    catch (error) {
        console.error("Error finding chapter:", error);
        return { message: "Error finding chapter", status: 500 };
    }
}, {
    query: z.object({
        number: z.coerce.number().int(),
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Find a chapter by number",
        description: "This endpoint allows users to find a chapter in the collection by providing the chapter number."
    }
}
)
