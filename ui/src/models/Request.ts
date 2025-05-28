import { Schema, model, models } from "mongoose";

export interface IRequest {
  userId: string;
  criteria: {
    os: string;
    budget: number;
    country: string;
    region: string;
    cpus: number;
    ram: number;
    vram: number;
  };
  createdAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    userId: { type: String, required: true },
    criteria: {
      os: { type: String, required: true },
      budget: { type: Number, required: true },
      country: { type: String, required: true },
      region: { type: String, required: true },
      cpus: { type: Number, required: true },
      ram: { type: Number, required: true },
      vram: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const RequestModel = models.Request || model<IRequest>("Request", requestSchema);

export default RequestModel;