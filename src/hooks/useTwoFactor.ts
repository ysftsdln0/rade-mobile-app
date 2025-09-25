import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { twoFactorProvider } from '../services/external';
import { useAppSelector } from '../store';

const QUERY_KEY = ['twoFactorStatus'];

export const useTwoFactor = () => {
  const user = useAppSelector((s) => s.auth.user);
  const queryClient = useQueryClient();

  const { data: enabled, isLoading: statusLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user) return false;
      return twoFactorProvider.isEnabled(user.id);
    },
    enabled: !!user,
  });

  const enableMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not found');
      return twoFactorProvider.enable(user.id);
    },
  });

  const disableMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not found');
      await twoFactorProvider.disable(user.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!user) throw new Error('User not found');
      return twoFactorProvider.verify(user.id, code);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const resend = useCallback(async () => {
    if (!user || !twoFactorProvider.resend) return;
    await twoFactorProvider.resend(user.id);
  }, [user]);

  return {
    enabled: enabled || false,
    statusLoading,
    enable: enableMutation.mutateAsync,
    enabling: enableMutation.isPending,
    setupData: enableMutation.data,
    disable: disableMutation.mutateAsync,
    disabling: disableMutation.isPending,
    verify: verifyMutation.mutateAsync,
    verifying: verifyMutation.isPending,
    verifyResult: verifyMutation.data,
    resend,
  };
};
