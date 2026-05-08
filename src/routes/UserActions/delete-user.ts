import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const deleteUserRoute = new Elysia().delete("/delete-user", async ({ body }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: body.userId }
        });
        if (!user) return { message: "User not found", status: 404 };
        await prisma.user.delete({
            where: { id: body.userId }
        });
        console.log("User deleted with: ", body);
        return { message: "User deleted successfully" };
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return { message: "Error deleting user", status: 500 };
    }
},{
    body: z.object({
        userId: z.string()
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Delete a user",
        description: "This endpoint allows users to delete their account by providing their user ID.",
    }
}
)