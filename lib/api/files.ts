import { FileListSchema, FileStatsSchema } from "@/schemas/fileSchema";
import { apiClient } from "@/utils/axios";

export const fetchFileStats = async () => {
  const res = await apiClient.get("/api/files/stats");
  return FileStatsSchema.parse(res.data);
};

export const fetchFiles = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const res = await apiClient.get(
    `/api/files?skip=${skip}&limit=20&search=${search}`
  );
  return FileListSchema.parse(res.data);
};
