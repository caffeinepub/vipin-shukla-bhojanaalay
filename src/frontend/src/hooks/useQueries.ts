import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useRestaurantInfo() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["restaurantInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRestaurantInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMenu() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenu();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReviews() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
  });
}
