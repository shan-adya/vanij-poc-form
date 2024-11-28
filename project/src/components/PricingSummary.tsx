import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useService } from "@/contexts/ServiceContext";

export default function PricingSummary() {
  const { selectedServices, totalPrice } = useService();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex justify-between">
              <span>{service.name}</span>
              <span className="font-medium">${service.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}