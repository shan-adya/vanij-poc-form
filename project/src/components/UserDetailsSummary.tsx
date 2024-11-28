import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserDetails } from '@/types';

interface UserDetailsSummaryProps {
  details: UserDetails | null;
}

export default function UserDetailsSummary({ details }: UserDetailsSummaryProps) {
  if (!details) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="text-lg">{details.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="text-lg">{details.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
            <dd className="text-lg">{details.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Company</dt>
            <dd className="text-lg">{details.company}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Designation</dt>
            <dd className="text-lg">{details.designation}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Use Case</dt>
            <dd className="text-lg whitespace-pre-wrap">{details.useCase}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}