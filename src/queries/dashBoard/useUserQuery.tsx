import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/apis/user";
import { IUser } from "@/types/user";

export const useUserQuery = () => {
  const { data, isLoading, error } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });

  return { data, isLoading, error };
};
