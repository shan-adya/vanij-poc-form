import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import RequestsOverview from '@/components/dashboard/RequestsOverview';
import ProfileSection from '@/components/dashboard/ProfileSection';
import ThemeToggle from '@/components/dashboard/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={() => navigate('/vanij-poc')} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Request
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <RequestsOverview />
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          <ProfileSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}