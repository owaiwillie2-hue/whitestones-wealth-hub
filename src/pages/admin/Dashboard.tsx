import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, DollarSign, FileText, UserCheck, TrendingUp, Clock } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingKYC: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeInvestments: 0,
    totalInvested: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, deposits, withdrawals, kyc, investments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('deposits').select('amount, status'),
        supabase.from('withdrawals').select('amount, status'),
        supabase.from('kyc_documents').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('investments').select('amount, status')
      ]);

      const pendingDeposits = deposits.data?.filter(d => d.status === 'pending') || [];
      const approvedDeposits = deposits.data?.filter(d => d.status === 'approved') || [];
      const pendingWithdrawals = withdrawals.data?.filter(w => w.status === 'pending') || [];
      const approvedWithdrawals = withdrawals.data?.filter(w => w.status === 'approved') || [];
      const activeInvestments = investments.data?.filter(i => i.status === 'active') || [];

      setStats({
        totalUsers: users.count || 0,
        pendingDeposits: pendingDeposits.length,
        pendingWithdrawals: pendingWithdrawals.length,
        pendingKYC: kyc.count || 0,
        totalDeposits: approvedDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0),
        totalWithdrawals: approvedWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0),
        activeInvestments: activeInvestments.length,
        totalInvested: activeInvestments.reduce((sum, i) => sum + Number(i.amount || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, subtitle, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of platform activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-500"
        />
        <StatCard
          title="Pending Deposits"
          value={stats.pendingDeposits}
          icon={Clock}
          subtitle={`$${stats.totalDeposits.toFixed(2)} total approved`}
          color="text-yellow-500"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={DollarSign}
          subtitle={`$${stats.totalWithdrawals.toFixed(2)} total approved`}
          color="text-orange-500"
        />
        <StatCard
          title="Pending KYC"
          value={stats.pendingKYC}
          icon={FileText}
          color="text-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Active Investments"
          value={stats.activeInvestments}
          icon={TrendingUp}
          subtitle={`$${stats.totalInvested.toFixed(2)} total invested`}
          color="text-green-500"
        />
        <StatCard
          title="Verified Users"
          value={stats.totalUsers - stats.pendingKYC}
          icon={UserCheck}
          color="text-cyan-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
