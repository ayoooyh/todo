import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/apis/dashBoard/users";

export const useUserQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });

  return { data, isLoading, error };
};
