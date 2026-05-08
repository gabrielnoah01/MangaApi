import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeUserPasswordRoute = new Elysia().put("/change-password", async ({ body }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: body.userId }
        });
        if (!user) return { message: "User not found", status: 404 };
        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: { password: body.newPassword }
        });
        console.log("User password updated with: ", body);
        return { message: "User password updated successfully", user: updatedUser };
    } catch (error) {
        console.error("Error updating user password:", error);
        return { message: "Error updating user password", status: 500 };
    }
}, {
    body: z.object({
        userId: z.string(),
        newPassword: z.string().min(6)
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Change the password of a user",
        description: "This endpoint allows users to change their password by providing their user ID and the new password. The new password must be at least 6 characters long.",
    }
}
)