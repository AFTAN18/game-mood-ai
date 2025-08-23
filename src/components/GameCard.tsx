import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Gamepad2 } from "lucide-react";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  genre: string | string[];
  rating: number;
  playtime: number;
  imageUrl: string;
  matchScore: number;
  reasons: string[];
  platform?: string[];
  price?: number;
  tags?: string[];
  completionStatus?: string;
  isInstalled?: boolean;
  lastPlayed?: Date;
  userRating?: number;
}

export const GameCard = ({ 
  id,
  title, 
  description, 
  genre, 
  rating, 
  playtime, 
  imageUrl, 
  matchScore,
  reasons,
  platform,
  price,
  tags,
  completionStatus,
  isInstalled,
  lastPlayed,
  userRating
}: GameCardProps) => {
  const formatPlaytime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatLastPlayed = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-glow transition-all duration-300 overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Match Score Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-accent/90 text-accent-foreground font-bold">
            {matchScore}% Match
          </Badge>
        </div>

        {/* Game Status Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {isInstalled && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Installed
            </Badge>
          )}
          {completionStatus && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              {completionStatus.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {/* Game Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {Array.isArray(genre) ? 
              genre.slice(0, 2).map((g, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-black/20 text-white border-white/30">
                  {g}
                </Badge>
              ))
              :
              <Badge variant="outline" className="text-xs bg-black/20 text-white border-white/30">
                {genre}
              </Badge>
            }
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">{rating}</span>
            </div>
            {userRating && (
              <div className="flex items-center gap-1">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">{userRating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <span className="font-medium">{formatPlaytime(playtime)}</span>
            <div className="text-xs text-muted-foreground">Playtime</div>
          </div>
          
          {lastPlayed && (
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <span className="font-medium text-xs">{formatLastPlayed(lastPlayed)}</span>
              <div className="text-xs text-muted-foreground">Last Played</div>
            </div>
          )}
        </div>

        {/* Why it matches */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Why it matches your mood:</h4>
          <div className="flex flex-wrap gap-1">
            {reasons.slice(0, 3).map((reason, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Platform and Price */}
        {(platform || price) && (
          <div className="flex items-center justify-between text-sm">
            {platform && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Platforms:</span>
                <div className="flex gap-1">
                  {platform.slice(0, 2).map((p, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {price && (
              <div className="font-medium text-primary">
                ${price}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Learn More
        </Button>
      </div>
    </Card>
  );
};