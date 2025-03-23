import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFurnitureSchema, insertRepairSchema, insertCleaningItemSchema, insertAssessmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Furniture routes
  app.get("/api/furniture", async (req, res) => {
    try {
      const furniture = await storage.getAllFurniture();
      res.json(furniture);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve furniture items" });
    }
  });

  app.get("/api/furniture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const furniture = await storage.getFurniture(id);
      if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
      }
      res.json(furniture);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve furniture" });
    }
  });

  app.post("/api/furniture", async (req, res) => {
    try {
      const validatedData = insertFurnitureSchema.parse(req.body);
      const furniture = await storage.createFurniture(validatedData);
      res.status(201).json(furniture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid furniture data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create furniture" });
    }
  });

  app.put("/api/furniture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFurnitureSchema.partial().parse(req.body);
      const furniture = await storage.updateFurniture(id, validatedData);
      if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
      }
      res.json(furniture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid furniture data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update furniture" });
    }
  });

  app.delete("/api/furniture/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFurniture(id);
      if (!success) {
        return res.status(404).json({ message: "Furniture not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete furniture" });
    }
  });

  // Repair routes
  app.get("/api/furniture/:furnitureId/repairs", async (req, res) => {
    try {
      const furnitureId = parseInt(req.params.furnitureId);
      const repairs = await storage.getRepairsByFurnitureId(furnitureId);
      res.json(repairs);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve repairs" });
    }
  });

  app.post("/api/repairs", async (req, res) => {
    try {
      const validatedData = insertRepairSchema.parse(req.body);
      const repair = await storage.createRepair(validatedData);
      res.status(201).json(repair);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid repair data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create repair" });
    }
  });

  app.put("/api/repairs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRepairSchema.partial().parse(req.body);
      const repair = await storage.updateRepair(id, validatedData);
      if (!repair) {
        return res.status(404).json({ message: "Repair not found" });
      }
      res.json(repair);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid repair data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update repair" });
    }
  });

  app.delete("/api/repairs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRepair(id);
      if (!success) {
        return res.status(404).json({ message: "Repair not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete repair" });
    }
  });

  // Cleaning routes
  app.get("/api/furniture/:furnitureId/cleaning", async (req, res) => {
    try {
      const furnitureId = parseInt(req.params.furnitureId);
      const cleaningItems = await storage.getCleaningItemsByFurnitureId(furnitureId);
      res.json(cleaningItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve cleaning items" });
    }
  });

  app.post("/api/cleaning", async (req, res) => {
    try {
      const validatedData = insertCleaningItemSchema.parse(req.body);
      const cleaningItem = await storage.createCleaningItem(validatedData);
      res.status(201).json(cleaningItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cleaning item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create cleaning item" });
    }
  });

  app.put("/api/cleaning/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCleaningItemSchema.partial().parse(req.body);
      const cleaningItem = await storage.updateCleaningItem(id, validatedData);
      if (!cleaningItem) {
        return res.status(404).json({ message: "Cleaning item not found" });
      }
      res.json(cleaningItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cleaning item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update cleaning item" });
    }
  });

  app.delete("/api/cleaning/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCleaningItem(id);
      if (!success) {
        return res.status(404).json({ message: "Cleaning item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cleaning item" });
    }
  });

  // Assessment routes
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve assessment" });
    }
  });

  app.get("/api/furniture/:furnitureId/assessment", async (req, res) => {
    try {
      const furnitureId = parseInt(req.params.furnitureId);
      const assessment = await storage.getAssessmentByFurnitureId(furnitureId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve assessment" });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateAssessment(id, validatedData);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update assessment" });
    }
  });

  app.delete("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAssessment(id);
      if (!success) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete assessment" });
    }
  });

  // Similar items route
  app.get("/api/similar-items/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const similarItems = await storage.getSimilarItems(type, limit);
      res.json(similarItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve similar items" });
    }
  });

  return httpServer;
}
