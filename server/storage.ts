import { 
  users, type User, type InsertUser,
  furniture, type Furniture, type InsertFurniture,
  repairs, type Repair, type InsertRepair,
  cleaningItems, type CleaningItem, type InsertCleaningItem,
  assessments, type Assessment, type InsertAssessment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Furniture methods
  createFurniture(furniture: InsertFurniture): Promise<Furniture>;
  getFurniture(id: number): Promise<Furniture | undefined>;
  getAllFurniture(): Promise<Furniture[]>;
  updateFurniture(id: number, furniture: Partial<InsertFurniture>): Promise<Furniture | undefined>;
  deleteFurniture(id: number): Promise<boolean>;
  
  // Repair methods
  createRepair(repair: InsertRepair): Promise<Repair>;
  getRepairsByFurnitureId(furnitureId: number): Promise<Repair[]>;
  updateRepair(id: number, repair: Partial<InsertRepair>): Promise<Repair | undefined>;
  deleteRepair(id: number): Promise<boolean>;
  
  // Cleaning methods
  createCleaningItem(cleaningItem: InsertCleaningItem): Promise<CleaningItem>;
  getCleaningItemsByFurnitureId(furnitureId: number): Promise<CleaningItem[]>;
  updateCleaningItem(id: number, cleaningItem: Partial<InsertCleaningItem>): Promise<CleaningItem | undefined>;
  deleteCleaningItem(id: number): Promise<boolean>;
  
  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentByFurnitureId(furnitureId: number): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  updateAssessment(id: number, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<boolean>;
  
  // Similar items
  getSimilarItems(furnitureType: string, limit?: number): Promise<Assessment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private furnitureItems: Map<number, Furniture>;
  private repairItems: Map<number, Repair>;
  private cleaningItems: Map<number, CleaningItem>;
  private assessmentItems: Map<number, Assessment>;
  
  private userCurrentId: number;
  private furnitureCurrentId: number;
  private repairCurrentId: number;
  private cleaningCurrentId: number;
  private assessmentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.furnitureItems = new Map();
    this.repairItems = new Map();
    this.cleaningItems = new Map();
    this.assessmentItems = new Map();
    
    this.userCurrentId = 1;
    this.furnitureCurrentId = 1;
    this.repairCurrentId = 1;
    this.cleaningCurrentId = 1;
    this.assessmentCurrentId = 1;
    
    // Add some starter data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Furniture methods
  async createFurniture(insertFurniture: InsertFurniture): Promise<Furniture> {
    const id = this.furnitureCurrentId++;
    const furniture: Furniture = { 
      ...insertFurniture, 
      id, 
      createdAt: new Date() 
    };
    this.furnitureItems.set(id, furniture);
    return furniture;
  }
  
  async getFurniture(id: number): Promise<Furniture | undefined> {
    return this.furnitureItems.get(id);
  }
  
  async getAllFurniture(): Promise<Furniture[]> {
    return Array.from(this.furnitureItems.values());
  }
  
  async updateFurniture(id: number, furnitureUpdate: Partial<InsertFurniture>): Promise<Furniture | undefined> {
    const furniture = this.furnitureItems.get(id);
    if (!furniture) return undefined;
    
    const updatedFurniture = { ...furniture, ...furnitureUpdate };
    this.furnitureItems.set(id, updatedFurniture);
    return updatedFurniture;
  }
  
  async deleteFurniture(id: number): Promise<boolean> {
    return this.furnitureItems.delete(id);
  }
  
  // Repair methods
  async createRepair(insertRepair: InsertRepair): Promise<Repair> {
    const id = this.repairCurrentId++;
    const repair: Repair = { ...insertRepair, id };
    this.repairItems.set(id, repair);
    return repair;
  }
  
  async getRepairsByFurnitureId(furnitureId: number): Promise<Repair[]> {
    return Array.from(this.repairItems.values()).filter(
      repair => repair.furnitureId === furnitureId
    );
  }
  
  async updateRepair(id: number, repairUpdate: Partial<InsertRepair>): Promise<Repair | undefined> {
    const repair = this.repairItems.get(id);
    if (!repair) return undefined;
    
    const updatedRepair = { ...repair, ...repairUpdate };
    this.repairItems.set(id, updatedRepair);
    return updatedRepair;
  }
  
  async deleteRepair(id: number): Promise<boolean> {
    return this.repairItems.delete(id);
  }
  
  // Cleaning methods
  async createCleaningItem(insertCleaningItem: InsertCleaningItem): Promise<CleaningItem> {
    const id = this.cleaningCurrentId++;
    const cleaningItem: CleaningItem = { ...insertCleaningItem, id };
    this.cleaningItems.set(id, cleaningItem);
    return cleaningItem;
  }
  
  async getCleaningItemsByFurnitureId(furnitureId: number): Promise<CleaningItem[]> {
    return Array.from(this.cleaningItems.values()).filter(
      item => item.furnitureId === furnitureId
    );
  }
  
  async updateCleaningItem(id: number, cleaningUpdate: Partial<InsertCleaningItem>): Promise<CleaningItem | undefined> {
    const cleaningItem = this.cleaningItems.get(id);
    if (!cleaningItem) return undefined;
    
    const updatedCleaningItem = { ...cleaningItem, ...cleaningUpdate };
    this.cleaningItems.set(id, updatedCleaningItem);
    return updatedCleaningItem;
  }
  
  async deleteCleaningItem(id: number): Promise<boolean> {
    return this.cleaningItems.delete(id);
  }
  
  // Assessment methods
  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentCurrentId++;
    const assessment: Assessment = { 
      ...insertAssessment, 
      id, 
      createdAt: new Date() 
    };
    this.assessmentItems.set(id, assessment);
    return assessment;
  }
  
  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessmentItems.get(id);
  }
  
  async getAssessmentByFurnitureId(furnitureId: number): Promise<Assessment | undefined> {
    return Array.from(this.assessmentItems.values()).find(
      assessment => assessment.furnitureId === furnitureId
    );
  }
  
  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessmentItems.values());
  }
  
  async updateAssessment(id: number, assessmentUpdate: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const assessment = this.assessmentItems.get(id);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, ...assessmentUpdate };
    this.assessmentItems.set(id, updatedAssessment);
    return updatedAssessment;
  }
  
  async deleteAssessment(id: number): Promise<boolean> {
    return this.assessmentItems.delete(id);
  }
  
  // Similar items
  async getSimilarItems(furnitureType: string, limit: number = 3): Promise<Assessment[]> {
    // Get furniture of the same type
    const furnitureOfType = Array.from(this.furnitureItems.values())
      .filter(item => item.type.toLowerCase() === furnitureType.toLowerCase());
    
    // Get assessments for these furniture items
    const assessments = furnitureOfType
      .map(furniture => {
        const assessment = Array.from(this.assessmentItems.values())
          .find(a => a.furnitureId === furniture.id);
        if (assessment) {
          return { ...assessment, furniture };
        }
        return null;
      })
      .filter(item => item !== null) as Assessment[];
    
    // Sort by profit (descending) and take limit
    return assessments
      .sort((a, b) => Number(b.profit) - Number(a.profit))
      .slice(0, limit);
  }
  
  // Add some sample data
  private seedData() {
    // Add sample furniture types
    const chairData: InsertFurniture = {
      type: "Chaise de Bureau",
      brand: "Steelcase",
      model: "Think v2",
      condition: "Bon",
      age: 5,
      acquisitionCost: "0",
      description: "Chaise de bureau noire avec accoudoirs réglables, dossier en mesh, roulettes fonctionnelles.",
      hasPhoto: false,
      hasDamage: true,
      isComplete: true
    };
    
    const chairData2: InsertFurniture = {
      type: "Chaise de Bureau",
      brand: "Herman Miller",
      model: "Aeron",
      condition: "Excellent",
      age: 3,
      acquisitionCost: "50",
      description: "Chaise haut de gamme, légères marques d'usure, tous réglages fonctionnels.",
      hasPhoto: true,
      hasDamage: false,
      isComplete: true
    };
    
    const chairData3: InsertFurniture = {
      type: "Chaise de Bureau",
      brand: "Haworth",
      model: "Zody",
      condition: "Moyen",
      age: 6,
      acquisitionCost: "20",
      description: "Chaise de bureau avec soutien lombaire, quelques taches.",
      hasPhoto: true,
      hasDamage: true,
      isComplete: true
    };
    
    // Create furniture entries
    this.createFurniture(chairData).then(chair => {
      // Create repair items for first chair
      this.createRepair({
        furnitureId: chair.id,
        name: "Remplacement des roulettes",
        isNeeded: true,
        cost: "20",
        timeMinutes: 15
      });
      
      this.createRepair({
        furnitureId: chair.id,
        name: "Remplacement du vérin",
        isNeeded: false,
        cost: "35",
        timeMinutes: 30
      });
      
      // Create cleaning items for first chair
      this.createCleaningItem({
        furnitureId: chair.id,
        name: "Nettoyage standard",
        isNeeded: true,
        cost: "5",
        timeMinutes: 20
      });
      
      this.createCleaningItem({
        furnitureId: chair.id,
        name: "Traitement du tissu",
        isNeeded: true,
        cost: "15",
        timeMinutes: 30
      });
      
      // Create assessment for first chair
      this.createAssessment({
        furnitureId: chair.id,
        marketValue: "200",
        expectedSellTime: 14,
        salesNotes: "Modèle recherché, bonne demande sur le marché local. Prévoir photos de qualité pour la mise en vente.",
        totalMaterialCost: "40",
        totalLaborMinutes: 65,
        hourlyLaborRate: "20",
        totalLaborCost: "21.67",
        totalCost: "61.67",
        profit: "138.33",
        marginPercentage: "69",
        isProfitable: true,
        repairItems: [],
        cleaningItems: []
      });
    });
    
    // Create second chair with assessments
    this.createFurniture(chairData2).then(chair => {
      this.createAssessment({
        furnitureId: chair.id,
        marketValue: "350",
        expectedSellTime: 7,
        salesNotes: "Modèle premium très recherché.",
        totalMaterialCost: "70",
        totalLaborMinutes: 90,
        hourlyLaborRate: "20",
        totalLaborCost: "30",
        totalCost: "150",
        profit: "200",
        marginPercentage: "57",
        isProfitable: true,
        repairItems: [],
        cleaningItems: []
      });
    });
    
    // Create third chair with assessments
    this.createFurniture(chairData3).then(chair => {
      this.createAssessment({
        furnitureId: chair.id,
        marketValue: "150",
        expectedSellTime: 21,
        salesNotes: "Reconditionnement simple.",
        totalMaterialCost: "35",
        totalLaborMinutes: 60,
        hourlyLaborRate: "20",
        totalLaborCost: "20",
        totalCost: "75",
        profit: "75",
        marginPercentage: "50",
        isProfitable: true,
        repairItems: [],
        cleaningItems: []
      });
    });
  }
}

export const storage = new MemStorage();
