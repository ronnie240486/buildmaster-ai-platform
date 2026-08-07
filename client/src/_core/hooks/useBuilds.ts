import { trpc } from "@/lib/trpc";

export function useBuilds(projectId: number) {
  const utils = trpc.useUtils();

  const listQuery = trpc.builds.list.useQuery({ projectId });

  const createMutation = trpc.builds.create.useMutation({
    onSuccess: () => {
      utils.builds.list.invalidate({ projectId });
    },
  });

  const updateStatusMutation = trpc.builds.updateStatus.useMutation({
    onSuccess: () => {
      utils.builds.list.invalidate({ projectId });
    },
  });

  return {
    builds: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    create: createMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
  };
}
