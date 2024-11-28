import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export default function ServiceCard({
  name,
  description,
  icon: Icon,
  selected,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }}
    >
      <Card
        className={cn(
          'modern-card cursor-pointer group relative overflow-hidden',
          'border-2 transition-all duration-300',
          'hover:shadow-2xl hover:shadow-primary/20',
          'hover:border-primary/50',
          selected && 'ring-2 ring-primary border-primary shadow-xl shadow-primary/30',
          'bg-gradient-to-br from-zinc-50/50 via-white to-zinc-50/50 dark:from-zinc-900/50 dark:via-zinc-800/50 dark:to-zinc-900/50',
          'backdrop-blur-sm'
        )}
        onClick={onClick}
      >
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5",
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )} 
        />

        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--primary-rgb),0.1),transparent_60%)]",
          "transition-opacity duration-500"
        )} />

        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/5 dark:from-white/5 dark:to-black/20" />

        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-500",
              "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5",
              "group-hover:scale-110 group-hover:rotate-3",
              "group-hover:shadow-lg group-hover:shadow-primary/20",
              selected && "from-primary via-secondary to-primary"
            )}>
              <Icon className={cn(
                "h-6 w-6 transition-all duration-500",
                "group-hover:scale-110",
                selected ? "text-white" : "text-primary group-hover:text-primary"
              )} />
            </div>
            <div>
              <CardTitle className={cn(
                "text-xl transition-colors duration-300",
                "bg-gradient-to-r from-primary to-secondary bg-clip-text",
                selected ? "text-transparent" : "group-hover:text-transparent"
              )}>
                {name}
              </CardTitle>
              <CardDescription className={cn(
                "mt-2 line-clamp-2",
                "transition-colors duration-300",
                selected && "text-foreground"
              )}>
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}