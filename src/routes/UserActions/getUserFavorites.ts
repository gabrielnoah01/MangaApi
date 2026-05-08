import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const GetUserFavoritesRoute = new Elysia().get("/favorites", async ({ query }) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: query.userId
            },
            include: {
                manga: true
            }
        });
        if (favorites.length === 0) return { message: "No favorites found for this user", status: 404 };
        return { favorites, status: 200 };
    }
    catch (error) {
        console.error("Error fetching favorites:", error);
        return { message: "Error fetching favorites", status: 500 };
    }
}, {
    query: z.object({
        userId: z.string()
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Get user's favorite manga",
        description: "This endpoint allows users to retrieve their list of favorite manga by providing their user ID.",
    }
}
)