import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface RequestSummaryProps {
  services: Service[];
  totalPrice: number;
}

export default function RequestSummary({ services, totalPrice }: RequestSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex justify-between items-start border-b pb-4 last:border-0">
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <span className="font-medium">{formatCurrency(service.price)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <span className="font-bold">Total</span>
            <span className="font-bold text-xl">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}