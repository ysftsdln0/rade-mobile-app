import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingProvider } from '../services/external';
import { useAppSelector } from '../store';

export const useInvoices = () => {
  const user = useAppSelector((s) => s.auth.user);
  const queryClient = useQueryClient();

  const invoicesQuery = useQuery({
    queryKey: ['invoices'],
    queryFn: () => {
      if (!user) return [];
      return billingProvider.listInvoices(user.id);
    },
    enabled: !!user,
  });

  const invoiceDetailsQuery = (invoiceId: string) => useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => {
      if (!user) return null;
      return billingProvider.getInvoice(user.id, invoiceId);
    },
    enabled: !!user && !!invoiceId,
  });

  const paymentMethodsQuery = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => {
      if (!user) return [];
      return billingProvider.listPaymentMethods(user.id);
    },
    enabled: !!user,
  });

  const payInvoiceMutation = useMutation({
    mutationFn: async (params: { invoiceId: string; methodId: string }) => {
      if (!user) throw new Error('User not found');
      return billingProvider.createPayment(user.id, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  return {
    invoicesQuery,
    invoiceDetailsQuery,
    paymentMethodsQuery,
    payInvoice: payInvoiceMutation.mutateAsync,
    paying: payInvoiceMutation.isPending,
    paymentResult: payInvoiceMutation.data,
  };
};
