import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

/** Either uploaded bytes (mimeType + imageData) or external imageUrl — enforced in application code */
const galleryImageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    caption: { type: String, trim: true, default: "", maxlength: 600 },
    imageUrl: { type: String, trim: true, default: "", maxlength: 2048 },
    mimeType: { type: String, trim: true, default: "" },
    imageData: { type: Schema.Types.Buffer, required: false, select: false },
  },
  { timestamps: true },
);

export type GalleryImageDocument = InferSchemaType<typeof galleryImageSchema> & {
  _id: Types.ObjectId;
};

export const GalleryImage: Model<GalleryImageDocument> =
  mongoose.models.GalleryImage ??
  mongoose.model<GalleryImageDocument>("GalleryImage", galleryImageSchema);
