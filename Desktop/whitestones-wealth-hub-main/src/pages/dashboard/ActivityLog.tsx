import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const ActivityLog = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setActivities(data || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activity logs yet</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-4 border rounded-lg space-y-1">
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(activity.created_at), 'PPpp')}
                </p>
                {activity.ip_address && (
                  <p className="text-xs text-muted-foreground">IP: {activity.ip_address}</p>
                )}
                {activity.location && (
                  <p className="text-xs text-muted-foreground">Location: {activity.location}</p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
