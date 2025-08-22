import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  genre: string;
  rating: number;
  playtime: string;
  players: string;
  imageUrl: string;
  matchScore: number;
  reasons: string[];
}

export const GameCard = ({ 
  title, 
  description, 
  genre, 
  rating, 
  playtime, 
  players, 
  imageUrl, 
  matchScore,
  reasons 
}: GameCardProps) => {
  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-glow transition-all duration-300 overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-accent/90 text-accent-foreground font-bold">
            {matchScore}% Match
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {genre}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{playtime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{players}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Why it matches your mood:</h4>
          <div className="flex flex-wrap gap-1">
            {reasons.map((reason, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Learn More
        </Button>
      </div>
    </Card>
  );
};