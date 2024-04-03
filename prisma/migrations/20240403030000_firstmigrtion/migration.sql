/*
  Warnings:

  - You are about to drop the column `postId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `CategoriesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CategoryId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_postId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "CategoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoriesOnPosts";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
