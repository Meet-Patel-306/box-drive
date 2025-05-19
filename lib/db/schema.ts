import {
  integer,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/singlestore";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  //files or folder detailes
  name: text("name").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(), //full path of file or folder
  type: text("type").notNull(), //files or folder
  //stroage information
  fileUrl: text("file_url").notNull(), //URL to access file given by server
  thumbnailUrl: text("thumbnail_url"),
  //ower
  userId: text("user_id").notNull(),
  parentId: text("parent_id"), //parent folder id or root folder
  //files or folder flags
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),
  isFolder: boolean("is_folder").default(false).notNull(),
  //time
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at").defaultNow().notNull(),
});

export const filesRelationShip = relations(files, ({ one, many }) => ({
  // parent - Each file or folder can have one parent folder
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  // children - Each folder can have many child files or folders
  children: many(files),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
