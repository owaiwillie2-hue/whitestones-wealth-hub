import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AdminDeposits = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const { data } = await supabase
        .from('deposits')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string, userId: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('deposits').update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user?.id
      }).eq('id', depositId);

      const { data: balance } = await supabase
        .from('account_balances')
        .select('main_balance, total_deposited')
        .eq('user_id', userId)
        .single();

      if (balance) {
        await supabase.from('account_balances').update({
          main_balance: Number(balance.main_balance) + amount,
          total_deposited: Number(balance.total_deposited) + amount
        }).eq('user_id', userId);
      }

      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'deposit',
        amount,
        balance_after: Number(balance?.main_balance || 0) + amount,
        reference_id: depositId,
        description: 'Deposit approved'
      });

      toast.success('Deposit approved successfully');
      fetchDeposits();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (depositId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('deposits').update({
        status: 'rejected',
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
        rejection_reason: 'Invalid proof of payment'
      }).eq('id', depositId);

      toast.success('Deposit rejected');
      fetchDeposits();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <p className="text-muted-foreground mt-2">Review and approve deposit requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deposits ({deposits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deposit.profiles?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{deposit.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${deposit.amount}</TableCell>
                  <TableCell>{deposit.payment_method}</TableCell>
                  <TableCell>
                    <Badge variant={
                      deposit.status === 'approved' ? 'default' :
                      deposit.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {deposit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(deposit.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {deposit.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(deposit.id, deposit.user_id, deposit.amount)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(deposit.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDeposits;
