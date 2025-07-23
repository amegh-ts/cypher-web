import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFiles } from "@/lib/api/files";

export const useInfiniteFiles = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["files", search],
    queryFn: ({ pageParam = 0 }) => fetchFiles({ skip: pageParam, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};
