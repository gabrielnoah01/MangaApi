-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('PLAN_TO_READ', 'READING', 'COMPLETED', 'ON_HOLD', 'DROPPED');

-- CreateEnum
CREATE TYPE "MangaStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MangaWorkflowStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "roleGrantedAt" TIMESTAMP(3),
    "roleGrantedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "description" TEXT,
    "status" "MangaStatus" NOT NULL DEFAULT 'ONGOING',
    "type" TEXT NOT NULL DEFAULT 'manga',
    "readingDirection" TEXT NOT NULL DEFAULT 'rtl',
    "genre" TEXT[],
    "publishedYear" INTEGER NOT NULL,
    "coverImagePath" TEXT,
    "coverImageMime" TEXT,
    "coverImageSize" INTEGER,
    "coverImageChecksum" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastChapterAt" TIMESTAMP(3),
    "workflowStatus" "MangaWorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "approvedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedRole" "UserRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "justification" TEXT,
    "portfolioUrl" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MangaModerationLog" (
    "id" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "actionById" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" "MangaWorkflowStatus",
    "toStatus" "MangaWorkflowStatus",
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MangaModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'PLAN_TO_READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReadingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "orderIndex" INTEGER,
    "isDoublePage" BOOLEAN NOT NULL DEFAULT false,
    "imagePath" TEXT NOT NULL,
    "imageMimeType" TEXT,
    "imageSizeBytes" INTEGER,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_roleGrantedById_idx" ON "User"("roleGrantedById");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Manga_title_key" ON "Manga"("title");

-- CreateIndex
CREATE INDEX "Manga_title_idx" ON "Manga"("title");

-- CreateIndex
CREATE INDEX "Manga_authorId_idx" ON "Manga"("authorId");

-- CreateIndex
CREATE INDEX "Manga_publishedYear_idx" ON "Manga"("publishedYear");

-- CreateIndex
CREATE INDEX "Manga_status_idx" ON "Manga"("status");

-- CreateIndex
CREATE INDEX "Manga_workflowStatus_idx" ON "Manga"("workflowStatus");

-- CreateIndex
CREATE INDEX "Manga_createdById_idx" ON "Manga"("createdById");

-- CreateIndex
CREATE INDEX "Manga_approvedById_idx" ON "Manga"("approvedById");

-- CreateIndex
CREATE INDEX "Manga_lastChapterAt_idx" ON "Manga"("lastChapterAt");

-- CreateIndex
CREATE INDEX "Manga_deletedAt_idx" ON "Manga"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorApplication_id_key" ON "CreatorApplication"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorApplication_userId_key" ON "CreatorApplication"("userId");

-- CreateIndex
CREATE INDEX "CreatorApplication_userId_idx" ON "CreatorApplication"("userId");

-- CreateIndex
CREATE INDEX "CreatorApplication_status_idx" ON "CreatorApplication"("status");

-- CreateIndex
CREATE INDEX "CreatorApplication_requestedRole_idx" ON "CreatorApplication"("requestedRole");

-- CreateIndex
CREATE INDEX "CreatorApplication_reviewedById_idx" ON "CreatorApplication"("reviewedById");

-- CreateIndex
CREATE INDEX "CreatorApplication_createdAt_idx" ON "CreatorApplication"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MangaModerationLog_mangaId_key" ON "MangaModerationLog"("mangaId");

-- CreateIndex
CREATE INDEX "MangaModerationLog_mangaId_idx" ON "MangaModerationLog"("mangaId");

-- CreateIndex
CREATE INDEX "MangaModerationLog_actionById_idx" ON "MangaModerationLog"("actionById");

-- CreateIndex
CREATE INDEX "MangaModerationLog_createdAt_idx" ON "MangaModerationLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_userEmail_key" ON "Author"("userEmail");

-- CreateIndex
CREATE INDEX "Author_name_idx" ON "Author"("name");

-- CreateIndex
CREATE INDEX "Author_userEmail_idx" ON "Author"("userEmail");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_mangaId_idx" ON "Review"("mangaId");

-- CreateIndex
CREATE INDEX "Review_deletedAt_idx" ON "Review"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_mangaId_key" ON "Review"("userId", "mangaId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_key" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_mangaId_idx" ON "Favorite"("mangaId");

-- CreateIndex
CREATE INDEX "Favorite_deletedAt_idx" ON "Favorite"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_mangaId_key" ON "Favorite"("userId", "mangaId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_userId_key" ON "ReadingList"("userId");

-- CreateIndex
CREATE INDEX "ReadingList_userId_idx" ON "ReadingList"("userId");

-- CreateIndex
CREATE INDEX "ReadingList_mangaId_idx" ON "ReadingList"("mangaId");

-- CreateIndex
CREATE INDEX "ReadingList_status_idx" ON "ReadingList"("status");

-- CreateIndex
CREATE INDEX "ReadingList_deletedAt_idx" ON "ReadingList"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_userId_mangaId_key" ON "ReadingList"("userId", "mangaId");

-- CreateIndex
CREATE INDEX "Chapter_mangaId_idx" ON "Chapter"("mangaId");

-- CreateIndex
CREATE INDEX "Chapter_mangaId_number_idx" ON "Chapter"("mangaId", "number");

-- CreateIndex
CREATE INDEX "Chapter_deletedAt_idx" ON "Chapter"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_mangaId_number_key" ON "Chapter"("mangaId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_mangaId_slug_key" ON "Chapter"("mangaId", "slug");

-- CreateIndex
CREATE INDEX "Page_chapterId_idx" ON "Page"("chapterId");

-- CreateIndex
CREATE INDEX "Page_orderIndex_idx" ON "Page"("orderIndex");

-- CreateIndex
CREATE INDEX "Page_checksum_idx" ON "Page"("checksum");

-- CreateIndex
CREATE INDEX "Page_deletedAt_idx" ON "Page"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Page_chapterId_number_key" ON "Page"("chapterId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Page_checksum_key" ON "Page"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "Page_imagePath_key" ON "Page"("imagePath");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleGrantedById_fkey" FOREIGN KEY ("roleGrantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MangaModerationLog" ADD CONSTRAINT "MangaModerationLog_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MangaModerationLog" ADD CONSTRAINT "MangaModerationLog_actionById_fkey" FOREIGN KEY ("actionById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
