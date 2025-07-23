import { useQuery } from "@tanstack/react-query";
import { fetchFileStats } from "@/lib/api/files";

export const useFileStats = () => {
  return useQuery({
    queryKey: ["file-stats"],
    queryFn: fetchFileStats,
  });
};
