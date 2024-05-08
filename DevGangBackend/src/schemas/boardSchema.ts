import mongoose, { Schema, Document } from 'mongoose';
import { BoardType } from '../types/board.types';

// Define the board schema
export const boardSchema: Schema<BoardType & Document> = new Schema({
  name: { type: String, required: true },
  stages: [{ type: String }]
});