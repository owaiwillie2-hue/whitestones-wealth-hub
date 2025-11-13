import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Users, DollarSign, FileCheck, Settings, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminDepositsTab from '@/components/admin/AdminDepositsTab';
import AdminWithdrawalsTab from '@/components/admin/AdminWithdrawalsTab';
import AdminKYCTab from '@/components/admin/AdminKYCTab';
import AdminSettingsTab from '@/components/admin/AdminSettingsTab';
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab';
import AdminReferralsTab from '@/components/admin/AdminReferralsTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalInvested: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingKYC: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
        return;
      }

      setUser(user);

      // Check if user is admin
      const { data: roleData } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (!roleData) {
        toast.error('Unauthorized: Admin access required');
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setIsAdmin(true);
      fetchStats();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Total deposits (approved)
      const { count: depositCount } = await supabase
        .from('deposits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Total invested
      const { data: investments } = await supabase
        .from('investments')
        .select('amount');

      const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

      // Pending deposits
      const { count: pendingDeposits } = await supabase
        .from('deposits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Pending withdrawals
      const { count: pendingWithdrawals } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Pending KYC
      const { count: pendingKYC } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: userCount || 0,
        totalDeposits: depositCount || 0,
        totalInvested,
        pendingDeposits: pendingDeposits || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        pendingKYC: pendingKYC || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Whitestones Markets Management Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">{user?.email}</span>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Deposits</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pendingDeposits}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Withdrawals</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pendingWithdrawals}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending KYC</p>
                  <p className="text-3xl font-bold text-red-400">{stats.pendingKYC}</p>
                </div>
                <FileCheck className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Management Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-slate-700">
                <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="deposits" className="flex items-center gap-2 text-xs">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">Deposits</span>
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Withdrawals</span>
                </TabsTrigger>
                <TabsTrigger value="kyc" className="flex items-center gap-2 text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">KYC</span>
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Referrals</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 text-xs">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="analytics" className="mt-4">
                  <AdminAnalyticsTab stats={stats} onStatsUpdate={fetchStats} />
                </TabsContent>

                <TabsContent value="users" className="mt-4">
                  <AdminUsersTab onUpdate={fetchStats} />
                </TabsContent>

                <TabsContent value="deposits" className="mt-4">
                  <AdminDepositsTab onUpdate={fetchStats} />
                </TabsContent>

                <TabsContent value="withdrawals" className="mt-4">
                  <AdminWithdrawalsTab onUpdate={fetchStats} />
                </TabsContent>

                <TabsContent value="kyc" className="mt-4">
                  <AdminKYCTab onUpdate={fetchStats} />
                </TabsContent>

                <TabsContent value="referrals" className="mt-4">
                  <AdminReferralsTab />
                </TabsContent>

                <TabsContent value="settings" className="mt-4">
                  <AdminSettingsTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
