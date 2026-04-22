import Elysia from "elysia";
import z from "zod";

export const UploadImageRoute = new Elysia().post("/upload-image", async ({request}) => {
  const form = await request.formData();
  const file = form.getAll("file");
  const mangaName = form.get("mangaName");
  const chapterNumber = form.get("chapterNumber");
  const userId = form.get("userId");
  
  if (!Array.isArray(file)) throw new Error("Arquivo inválido")
  const schema = z.instanceof(File)
  .refine(file => file.size < 5_000_000)
  .refine(file => file.type.startsWith("image/"))

  file.forEach(f => {
    schema.parse(f);
  })
  console.log("Image uploaded with: ", file);
  return { message: "Image uploaded successfully" };
},{
    detail: {
        tags: ["Image Upload", "Manga Management"],
        summary: "Upload an image for a manga",
        description: "This endpoint allows users to upload an image for a manga. The image must be less than 5MB and of type image/*.",
    }
})