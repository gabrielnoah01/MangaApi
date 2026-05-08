import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeUserEmailRoute = new Elysia().put("/change-email", async ({ body }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: body.userId }
        });
        if (!user) return { message: "User not found", status: 404 };
        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: { email: body.newEmail }
        });
        console.log("User email updated with: ", body);
        return { message: "User email updated successfully", user: updatedUser };
    }
    catch (error) {
        console.error("Error updating user email:", error);
        return { message: "Error updating user email", status: 500 };
    }
},{
    body: z.object({
        userId: z.string(),
        newEmail: z.string().email()
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Change the email of a user",
        description: "This endpoint allows users to change their email by providing their user ID and the new email.",
    }
}
)