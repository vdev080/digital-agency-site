import mongoose from "mongoose";

const orderedTextSchema = new mongoose.Schema(
  { text: { type: String, required: true, trim: true, maxlength: 300 }, sortOrder: { type: Number, default: 0 } },
  { _id: false },
);
const statisticSchema = new mongoose.Schema(
  { value: { type: String, required: true, trim: true, maxlength: 60 }, label: { type: String, required: true, trim: true, maxlength: 160 }, sortOrder: { type: Number, default: 0 } },
  { _id: false },
);
const serviceSchema = new mongoose.Schema(
  { title: { type: String, required: true, trim: true, maxlength: 160 }, iconUrl: { type: String, trim: true, maxlength: 2048 }, sortOrder: { type: Number, default: 0 } },
  { _id: false },
);
const workSchema = new mongoose.Schema(
  { imageUrl: { type: String, trim: true, maxlength: 2048 }, title: { type: String, trim: true, maxlength: 160 }, url: { type: String, trim: true, maxlength: 2048 }, sortOrder: { type: Number, default: 0 } },
  { _id: false },
);

const homepageSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "homepage", unique: true, immutable: true, select: false },
    banner: {
      heading: { type: String, required: true, trim: true, maxlength: 500 },
      description: { type: String, required: true, trim: true, maxlength: 2000 },
      statistics: { type: [statisticSchema], default: [] },
    },
    bannerInfo: {
      topList: { type: [orderedTextSchema], default: [] },
      founder: {
        name: { type: String, trim: true, maxlength: 160 },
        title: { type: String, trim: true, maxlength: 160 },
        imageUrl: { type: String, trim: true, maxlength: 2048 },
      },
      heading: { type: String, required: true, trim: true, maxlength: 2000 },
      services: { type: [serviceSchema], default: [] },
    },
    work: { type: [workSchema], default: [] },
  },
  { timestamps: true },
);

homepageSchema.set("toJSON", { transform: (_document, returned) => { delete returned.singletonKey; return returned; } });
export default mongoose.model("Homepage", homepageSchema);
