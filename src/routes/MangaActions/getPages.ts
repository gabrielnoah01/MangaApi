import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const getPages = new Elysia().get("/get-pages", async ({ query }) => {
    try {
        const pages = await prisma.page.findMany({
            where: {
                chapterId: query.chapterId
            }
        });
        if (pages.length === 0) return { message: "No pages found for this chapter", status: 404 };
        let allPages: Array<{ pageNumber: number; imageUrl: string }> = [];
        pages.forEach(page => {
const imageUrl = `http://localhost:3000/${page.imagePath.replace(/\\/g, "/").split("uploads/")[1]}`;
            allPages.push({ pageNumber: page.number, imageUrl });
        });
        return { pages: allPages, status: 200 };

    } catch (error) {
        console.error("Error fetching pages:", error);
        return { message: "Error fetching pages", status: 500 };
    }
}, {
    query: z.object({
        chapterId: z.string().uuid()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Get pages for a specific chapter",
        description: "This endpoint allows users to retrieve all pages associated with a specific chapter."
    }
});
