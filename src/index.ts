import { Elysia } from "elysia";
import openapi from "@elysiajs/openapi";
import * as z from "zod";
import { SignUpRoute } from "./routes/UserActions/sign-up";
import { SignInRoute } from "./routes/UserActions/sign-in";
import { AddMangaRoute } from "./routes/MangaActions/add-manga";
import { UploadImageRoute } from "./routes/MangaActions/upload-image";
import PrismaClient from "@prisma/client";
import { FindMangaRoute } from "./routes/MangaActions/find-manga";
import { findChapterRoute } from "./routes/MangaActions/find-chapter";
import staticPlugin from "@elysiajs/static";
import { getPages } from "./routes/MangaActions/getPages";
export const prisma  = new PrismaClient.PrismaClient();
import { join } from "path";
import { FavoriteRoute } from "./routes/UserActions/favorite";
import { GetUserFavoritesRoute } from "./routes/UserActions/getUserFavorites";
import { changeMangaDescriptionRoute } from "./routes/MangaActions/ChangeRoutes/change-manga-description";
import { changeMangaGenreRoute } from "./routes/MangaActions/ChangeRoutes/change-manga-genre";
import { changeMangaTitleRoute } from "./routes/MangaActions/ChangeRoutes/change-manga-title";
import { changeMangaCoverImagePathRoute } from "./routes/MangaActions/ChangeRoutes/change-manga-coverImagePath";
import { changeUserEmailRoute } from "./routes/UserActions/ChangeRoutes/change-user-email";
import { changeUserPhotoRoute } from "./routes/UserActions/ChangeRoutes/change-user-photo";
import { changeUserPasswordRoute } from "./routes/UserActions/ChangeRoutes/change-user-password";
import { getUserPhoto } from "./routes/UserActions/getUserPhoto";
const app = new Elysia().use(openapi({
  mapJsonSchema: {
    zod: z.toJSONSchema
  },
  documentation: {
    tags: [
      {name: "Authentication", description: "Endpoints related to user authentication"}
    ]
  }
}))
.use(SignUpRoute)
.use(SignInRoute)
.use(AddMangaRoute)
.use(UploadImageRoute)
.use(FindMangaRoute)
.use(findChapterRoute)
.use(getPages)
.use(FavoriteRoute)
.use(GetUserFavoritesRoute)
.use(changeMangaDescriptionRoute)
.use(changeMangaGenreRoute)
.use(changeMangaTitleRoute)
.use(changeMangaCoverImagePathRoute)
.use(changeUserEmailRoute)
.use(changeUserPhotoRoute)
.use(changeUserPasswordRoute)
.use(getUserPhoto)
.listen(3000);
app.use(staticPlugin({ assets: join(process.cwd(), "uploads"), prefix: "/" }));

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
