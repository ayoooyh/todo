import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/apis/dashBoard/user";

export const useUserQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  return { data, isLoading, error };
};
