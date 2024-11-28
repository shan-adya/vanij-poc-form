import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useService } from '@/contexts/ServiceContext';
import { formatCurrency } from '@/lib/utils';
import { MOCK_REQUESTS, SERVICES } from '@/lib/constants';
import RequestStatusBadge from './RequestStatusBadge';
import RequestDetailsDialog from './RequestDetailsDialog';
import { format } from 'date-fns';
import { Eye, XCircle } from 'lucide-react';
import { Request } from '@/types';
import { toast } from 'sonner';

export default function RequestsOverview() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<Request | null>(null);

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleCancelRequest = (request: Request) => {
    setRequestToCancel(request);
    setIsCancelOpen(true);
  };

  const confirmCancel = () => {
    if (requestToCancel) {
      // In a real app, we would call an API here
      toast.success('Request cancelled successfully');
      setIsCancelOpen(false);
      setRequestToCancel(null);
    }
  };

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_REQUESTS.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{request.id}</h3>
                      <RequestStatusBadge status={request.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.services
                        .map((serviceId) => SERVICES.find((s) => s.id === serviceId)?.name)
                        .join(', ')}
                    </div>
                    <div className="text-sm">
                      Last updated: {format(request.lastUpdated, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total Value</div>
                      <div className="font-bold">{formatCurrency(request.pricing)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {(request.status === 'pending' || request.status === 'in-progress') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRequest(request)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <RequestDetailsDialog
        request={selectedRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, cancel request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}