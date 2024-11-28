import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSection() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">{user?.name || 'Guest User'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{user?.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}