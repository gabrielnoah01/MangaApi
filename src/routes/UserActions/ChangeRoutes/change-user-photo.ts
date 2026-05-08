import Elysia from "elysia";
import z from "zod";
import { prisma } from "../../..";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

export const changeUserPhotoRoute = new Elysia().post("/change-photo", async ({ request }) => {
    try {
        const form = await request.formData();
        const newPhoto = form.get("newPhoto") as File
        const userId = form.get("userId") as string
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) return { message: "User not found", status: 404 };
          const uploadDir = join(process.cwd(), "uploads", "Users", userId);
          await mkdir(uploadDir, { recursive: true });
            if (!newPhoto) throw new Error("Nenhum arquivo enviado");
          const schema = z.instanceof(File)
            .refine(file => file.size < 5_000_000)
            .refine(file => file.type.startsWith("image/"))
            schema.parse(newPhoto);
            const filename = `profile_${newPhoto.name}_${Date.now()}`;
            const filepath = join(uploadDir, filename);
            const buffer = Buffer.from(await newPhoto.arrayBuffer())
            await writeFile(filepath, buffer);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { photo: filepath }
        });
        console.log("User photo updated with: ", newPhoto);
        return { message: "User photo updated successfully", user: updatedUser };
    }
    catch (error) {
        console.error("Error updating user photo:", error);
        return { message: "Error updating user photo", status: 500 };
    }},{
    detail: {
        tags: ["User Actions"],
        summary: "Change the photo of a user",
        description: "This endpoint allows users to change their photo by providing their user ID and the new photo URL.",
    }
}
)