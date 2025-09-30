import { z } from "zod";

export const FileItemSchema = z.object({
  _id: z.string(),
  file_name: z.string(),
  file_type: z.string(),
  file_size: z.number(),
});

export const FileListSchema = z.array(FileItemSchema);

export const FileStatsSchema = z.object({
  totalFiles: z.number(),
  totalSize: z.number(),
  videoCount: z.number(),
  avgSize: z.number(),
});
