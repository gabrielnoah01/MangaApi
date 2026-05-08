import Elysia from "elysia";
import z from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "../..";


export const UploadImageRoute = new Elysia().post("/upload-image", async ({request}) => {
  const form = await request.formData();
  const files = form.getAll("file");
  const mangaName = form.get("mangaName");
  const chapterNumber = form.get("chapterNumber");
  const chapterName = form.get("chapterName") || `Capítulo ${chapterNumber}`;
  const mangaId = form.get("mangaId") as string;
  const fixName = (str: string) => str.trim().replace(/\s+/g, "_")
  const uploadDir = join(process.cwd(), "uploads", "Mangas", fixName(mangaName as string), `Capitulo_${chapterNumber}`);
  await mkdir(uploadDir, { recursive: true });
  if (!files.length) throw new Error("Nenhum arquivo enviado");
const schema = z.instanceof(File)
  .refine(file => file.size < 5_000_000)
  .refine(file => file.type.startsWith("image/"))

  const savedPaths: string[] = [];
  try {
  let chapter = await prisma.chapter.findUnique({
  where: { mangaId_number: { mangaId, number: Number(chapterNumber) } }
});

if (!chapter) {
  chapter = await prisma.chapter.create({
    data: {
      number: Number(chapterNumber),
      mangaId,
      title: chapterName as string,
    }
  });
}

const existingPages = await prisma.page.count({ where: { chapterId: chapter.id } });
  if (chapter) {
    for (const [index, file] of files.entries()){
    const pageNumber = existingPages + index + 1;
    schema.parse(file);
    const f = file as File;
    const filename = `${index + 1}-${f.name}`;
    const filepath = join(uploadDir, filename);
    const buffer = Buffer.from(await f.arrayBuffer())
    await writeFile(filepath, buffer);
    savedPaths.push(filepath);
    console.log(`File saved at: ${filepath}`);
    try {
      await prisma.page.create({
      data: {
        number: pageNumber,
        imagePath: filepath,
        imageMimeType: f.type,
        imageSizeBytes: f.size,
        chapter: {
          connect: {
            mangaId_number: {
              mangaId: mangaId,
              number: Number(chapterNumber)
            } 
          }
        }
      }
    });
    }catch (error) {
      console.error("Error creating page record:", error);
      throw new Error("Error creating page record");
    }
  }
  }
  return { message: "Files uploaded successfully, created new chapter", paths: savedPaths };
  } catch (error) {
    console.error(error);
    throw error;
  }
}, {
    detail: {
        tags: ["Image Upload", "Manga Management"],
        summary: "Upload an image for a manga",
        description: "This endpoint allows users to upload an image for a manga. The image must be less than 5MB and of type image/*.",
    }
});