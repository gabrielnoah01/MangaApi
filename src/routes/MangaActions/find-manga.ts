import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const FindMangaRoute = new Elysia().get("/find-manga", async ({query}) => {
  try {
    console.log(query.title)
    const manga = await prisma.manga.findUnique({
        where: {
            title: query.title
        }
    });
    if (!manga) return { message: "Manga not found", status: 404 };
    return { message: "Manga found successfully", manga };
  }
    catch (error) {
        console.error("Error finding manga:", error);
        return { message: "Error finding manga", status: 500 };
    }
}
,{
    query: z.object({
        title: z.string()
    }),
    detail: {
        tags: ["Manga Management"],
        summary: "Find a manga by title",
        description: "This endpoint allows users to find a manga in the collection by providing the title.",
    }
}
)

// 