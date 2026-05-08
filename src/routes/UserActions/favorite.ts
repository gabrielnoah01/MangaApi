import Elysia from "elysia";
import z from "zod";
import { prisma } from "../..";

export const FavoriteRoute = new Elysia().post("/favorite", async ({ body }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: body.userId }
    });
    if (!user) return { message: "User not found", status: 404 };
    const manga = await prisma.manga.findUnique({
      where: { id: body.mangaId }
    });
    if (!manga) return { message: "Manga not found", status: 404 };
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_mangaId: {
            userId: body.userId,
            mangaId: body.mangaId
        }
      }
    });
    if (existingFavorite) return { message: "Manga already favorited", status: 409 };
    const newFavorite = await prisma.favorite.create({
      data: {
        userId: body.userId,
        mangaId: body.mangaId
      }
    });
    console.log("Manga favorited with: ", body);
    return { message: "Manga favorited successfully", favorite: newFavorite };
  }
    catch (error) {
        console.error("Error favoriting manga:", error);
        return { message: "Error favoriting manga", status: 500 };
    }
},{
  body: z.object({
    userId: z.string(),
    mangaId: z.string()
  }),
  detail: {
    tags: ["User Actions"],
    summary: "Favorite a manga",
    description: "This endpoint allows users to favorite a manga by providing their user ID and the manga ID.",
  }
}
)