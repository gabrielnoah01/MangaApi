import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";

export const changeUserNameRoute = new Elysia().put("/change-name", async ({ body }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: body.userId }
        });
        if (!user) return { message: "User not found", status: 404 };
        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: { name: body.newName }
        });
        console.log("User name updated with: ", body);
        return { message: "User name updated successfully", user: updatedUser };
    }
    catch (error) {
        console.error("Error updating user name:", error);
        return { message: "Error updating user name", status: 500 };
    }
},{
    body: z.object({
        userId: z.string(),
        newName: z.string()
    }),
    detail: {
        tags: ["User Actions"],
        summary: "Change the name of a user",
        description: "This endpoint allows users to change their name by providing their user ID and the new name.",
    }
}
)