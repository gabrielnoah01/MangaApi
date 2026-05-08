import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const getUserPhoto = new Elysia().get("/get-user-photo", async ({ query }) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: query.userId
            },
            select: {
                photo: true
            }
        });
        if (!user || !user.photo) return { message: "User or photo not found", status: 404 };
        const imageUrl = `http://localhost:3000/${user.photo.replace(/\\/g, "/").split("uploads/")[1]}`;

        return { photo: imageUrl, status: 200 };
    } catch (error) {
        console.error("Error fetching user photo:", error);
        return { message: "Error fetching user photo", status: 500 };
    }
}, {
    query: z.object({
        userId: z.string()
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Get user's profile photo",
        description: "This endpoint allows users to retrieve their profile photo by providing their user ID.",
    }
}
)