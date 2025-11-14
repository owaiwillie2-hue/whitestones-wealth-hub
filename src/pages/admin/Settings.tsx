import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    deposit_address: '',
    deposit_qr_url: '',
    company_address: '',
    company_phone: '',
    company_email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('website_settings')
        .select('*');

      if (data) {
        const settingsObj: any = {};
        data.forEach(item => {
          settingsObj[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        await supabase
          .from('website_settings')
          .upsert(update, { onConflict: 'key' });
      }

      toast.success('Settings saved successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <p className="text-muted-foreground mt-2">Manage website configuration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deposit_address">Bitcoin Deposit Address</Label>
              <Textarea
                id="deposit_address"
                value={settings.deposit_address}
                onChange={(e) => setSettings({ ...settings, deposit_address: e.target.value })}
                placeholder="bc1q..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="deposit_qr_url">Deposit QR Code URL</Label>
              <Input
                id="deposit_qr_url"
                value={settings.deposit_qr_url}
                onChange={(e) => setSettings({ ...settings, deposit_qr_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_address">Company Address</Label>
              <Textarea
                id="company_address"
                value={settings.company_address}
                onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                placeholder="123 Financial District..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="company_phone">Company Phone</Label>
              <Input
                id="company_phone"
                value={settings.company_phone}
                onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="company_email">Company Email</Label>
              <Input
                id="company_email"
                type="email"
                value={settings.company_email}
                onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={loading} size="lg">
        <Save className="mr-2 h-5 w-5" />
        {loading ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default AdminSettings;
