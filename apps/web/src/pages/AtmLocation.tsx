import { MapPin, Recycle, Wifi, WifiOff, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Skeleton from '@/components/ui/skeleton';
import { useMachines } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function AtmLocation() {
  const { data: machines, isLoading } = useMachines();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">ATM Location</h1>
        <p className="text-sm text-muted-foreground">Find nearby EcoATM machines to deposit your recyclables</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !machines?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="font-semibold text-lg">No machines found</p>
          <p className="text-sm">Check back later for nearby EcoATMs</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine: any) => (
            <Card key={machine.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className={cn(
                'h-1.5 w-full',
                machine.status === 'ONLINE' ? 'bg-emerald-500' : machine.status === 'MAINTENANCE' ? 'bg-amber-500' : 'bg-red-500'
              )} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      machine.status === 'ONLINE' ? 'bg-emerald-500/10' : machine.status === 'MAINTENANCE' ? 'bg-amber-500/10' : 'bg-red-500/10'
                    )}>
                      <Recycle className={cn(
                        'h-5 w-5',
                        machine.status === 'ONLINE' ? 'text-emerald-400' : machine.status === 'MAINTENANCE' ? 'text-amber-400' : 'text-red-400'
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold">{machine.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{machine.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={machine.status === 'ONLINE' ? 'success' : machine.status === 'MAINTENANCE' ? 'warning' : 'secondary'} className="capitalize">
                    {machine.status === 'ONLINE' ? (
                      <><Wifi className="h-3 w-3 mr-1" /> Online</>
                    ) : machine.status === 'MAINTENANCE' ? (
                      <><Clock className="h-3 w-3 mr-1" /> Maintenance</>
                    ) : (
                      <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Fill Level</span>
                    <span className={cn(
                      'font-medium',
                      machine.fillLevel > 80 ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {machine.fillLevel}%
                    </span>
                  </div>
                  <Progress value={machine.fillLevel} className="h-2" />
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {machine.status === 'ONLINE' ? 'Active now' : 'Last active: recently'}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(machine.acceptedTypes || []).map((type: string) => (
                    <Badge key={type} variant="outline" className="text-[10px] capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
