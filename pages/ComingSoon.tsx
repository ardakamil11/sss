import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const ComingSoon = ({ title, description, icon: Icon }: ComingSoonProps) => {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/20 rounded-lg p-8">
              <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Yakında Geliyor</h3>
              <p className="text-muted-foreground">
                Bu özellik şu anda geliştirilme aşamasında. Çok yakında sizlerle buluşacak!
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Geliştirme sürecinde</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;