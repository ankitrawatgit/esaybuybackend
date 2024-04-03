/*
  Warnings:

  - You are about to drop the column `category` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_postId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "category",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Tags";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnPosts" (
    "postId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnPosts_pkey" PRIMARY KEY ("postId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
