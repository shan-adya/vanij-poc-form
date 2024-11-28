import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Request } from '@/types';
import { SERVICES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import RequestStatusBadge from './RequestStatusBadge';
import { format } from 'date-fns';

interface RequestDetailsDialogProps {
  request: Request | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestDetailsDialog({
  request,
  open,
  onOpenChange,
}: RequestDetailsDialogProps) {
  if (!request) return null;

  const selectedServices = request.services
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Request ID</p>
                <p className="text-lg font-medium">{request.id}</p>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Selected Services</p>
              <div className="space-y-3">
                {selectedServices.map((service) => service && (
                  <div key={service.id} className="flex justify-between items-start border-b pb-3">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(service.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(request.pricing)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg">{format(request.lastUpdated, 'PPP')}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Timeline</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm">
                    Request created on {format(request.lastUpdated, 'PPP')}
                  </p>
                </div>
                {request.status === 'in-progress' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-sm">
                      Processing started on {format(request.lastUpdated, 'PPP')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}