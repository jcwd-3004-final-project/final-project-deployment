// src/controllers/category.controller.ts

import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  // Create a new category
  async createCategory(req: Request, res: Response) {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all categories
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get category by ID
  async getCategoryById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const category = await this.categoryService.getCategoryById(id);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // Update category
  async updateCategory(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        id,
        req.body
      );
      res.status(200).json(updatedCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete category
  async deleteCategory(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const result = await this.categoryService.deleteCategory(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
