import { pgTable, text, serial, integer, boolean, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Furniture schemas
export const furniture = pgTable("furniture", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  condition: text("condition").notNull(),
  age: integer("age"),
  acquisitionCost: numeric("acquisition_cost", { precision: 10, scale: 2 }).default("0"),
  description: text("description"),
  hasPhoto: boolean("has_photo").default(false),
  hasDamage: boolean("has_damage").default(false),
  isComplete: boolean("is_complete").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFurnitureSchema = createInsertSchema(furniture).omit({
  id: true,
  createdAt: true,
});

export type InsertFurniture = z.infer<typeof insertFurnitureSchema>;
export type Furniture = typeof furniture.$inferSelect;

// Reconditioning assessment schemas
export const repairs = pgTable("repairs", {
  id: serial("id").primaryKey(),
  furnitureId: integer("furniture_id").notNull(),
  name: text("name").notNull(),
  isNeeded: boolean("is_needed").default(false),
  cost: numeric("cost", { precision: 10, scale: 2 }).default("0"),
  timeMinutes: integer("time_minutes").default(0),
});

export const insertRepairSchema = createInsertSchema(repairs).omit({
  id: true,
});

export type InsertRepair = z.infer<typeof insertRepairSchema>;
export type Repair = typeof repairs.$inferSelect;

export const cleaningItems = pgTable("cleaning_items", {
  id: serial("id").primaryKey(),
  furnitureId: integer("furniture_id").notNull(),
  name: text("name").notNull(),
  isNeeded: boolean("is_needed").default(false),
  cost: numeric("cost", { precision: 10, scale: 2 }).default("0"),
  timeMinutes: integer("time_minutes").default(0),
});

export const insertCleaningItemSchema = createInsertSchema(cleaningItems).omit({
  id: true,
});

export type InsertCleaningItem = z.infer<typeof insertCleaningItemSchema>;
export type CleaningItem = typeof cleaningItems.$inferSelect;

// Assessment schemas
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  furnitureId: integer("furniture_id").notNull(),
  marketValue: numeric("market_value", { precision: 10, scale: 2 }).default("0"),
  expectedSellTime: integer("expected_sell_time").default(0),
  salesNotes: text("sales_notes"),
  totalMaterialCost: numeric("total_material_cost", { precision: 10, scale: 2 }).default("0"),
  totalLaborMinutes: integer("total_labor_minutes").default(0),
  hourlyLaborRate: numeric("hourly_labor_rate", { precision: 10, scale: 2 }).default("20"),
  totalLaborCost: numeric("total_labor_cost", { precision: 10, scale: 2 }).default("0"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).default("0"),
  profit: numeric("profit", { precision: 10, scale: 2 }).default("0"),
  marginPercentage: numeric("margin_percentage", { precision: 10, scale: 2 }).default("0"),
  isProfitable: boolean("is_profitable").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  repairItems: json("repair_items").$type<Repair[]>(),
  cleaningItems: json("cleaning_items").$type<CleaningItem[]>(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Photos
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  furnitureId: integer("furniture_id").notNull().references(() => furniture.id),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  type: text("type").notNull(), // 'before', 'after', 'damage'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;
