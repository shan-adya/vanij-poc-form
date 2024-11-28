import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  name: string;
  description: string;
  price: number;
  cloudCosts: string;
  thirdPartyFees: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export default function ServiceCard({
  name,
  description,
  price,
  cloudCosts,
  thirdPartyFees,
  icon: Icon,
  selected,
  onClick,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'modern-card cursor-pointer group transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/20',
        'active:scale-[0.98]',
        selected && 'ring-2 ring-primary shadow-lg shadow-primary/30',
        'motion-safe:animate-fadeIn relative overflow-hidden'
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-secondary/10" />

      <CardHeader className="relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg gradient-bg group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {name}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Base Price</span>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              ${price.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              Est. Cloud Costs: {cloudCosts}
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary/50" />
              Third-party Fees: {thirdPartyFees}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}