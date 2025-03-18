import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/apis/dashBoard/user";

export const useUserQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });

  return { data, isLoading, error };
};
