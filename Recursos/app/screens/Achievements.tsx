import { Trophy, Award, Star, Target, Zap, Crown, Medal, Flame } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { Badge } from "../components/ui/badge";
import { IconBadge } from "../components/IconBadge";
import { PremiumCard } from "../components/PremiumCard";
import { Progress } from "../components/ui/progress";

export function AchievementsScreen() {
  const familyMembers = [
    { name: "Mom", avatar: "👩", points: 1250, level: 12, badges: 18, rank: 1 },
    { name: "Dad", avatar: "👨", points: 1180, level: 11, badges: 15, rank: 2 },
    { name: "Emma", avatar: "👧", points: 890, level: 9, badges: 12, rank: 3 },
    { name: "Jake", avatar: "👦", points: 720, level: 7, badges: 9, rank: 4 },
  ];

  const recentBadges = [
    { 
      id: 1, 
      name: "Week Warrior", 
      description: "Completed all tasks for 7 days straight",
      icon: Flame,
      earnedBy: "Mom",
      earnedDate: "2 days ago",
      rarity: "rare",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    { 
      id: 2, 
      name: "Goal Crusher", 
      description: "Achieved 3 goals in one month",
      icon: Target,
      earnedBy: "Dad",
      earnedDate: "5 days ago",
      rarity: "epic",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      id: 3, 
      name: "Team Player", 
      description: "Helped complete 10 family goals",
      icon: Star,
      earnedBy: "Emma",
      earnedDate: "1 week ago",
      rarity: "common",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
  ];

  const availableBadges = [
    { 
      name: "Perfect Week", 
      description: "Complete all tasks for 7 consecutive days",
      icon: Crown,
      progress: 85,
      current: 6,
      target: 7,
      rarity: "legendary",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    { 
      name: "Reading Master", 
      description: "Read 20 books in a month",
      icon: Award,
      progress: 60,
      current: 12,
      target: 20,
      rarity: "epic",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      name: "Fitness Champion", 
      description: "Exercise 30 times in a month",
      icon: Zap,
      progress: 40,
      current: 12,
      target: 30,
      rarity: "rare",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
  ];

  const getRarityBadge = (rarity: string) => {
    const styles = {
      common: "bg-slate-100 text-slate-700 border-slate-200",
      rare: "bg-blue-100 text-blue-700 border-blue-200",
      epic: "bg-purple-100 text-purple-700 border-purple-200",
      legendary: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return styles[rarity as keyof typeof styles] || styles.common;
  };

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Achievements" 
        subtitle="Family rewards & badges"
      />

      <main className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {/* Family Leaderboard */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Family Leaderboard</h3>
          <div className="space-y-2.5">
            {familyMembers.map((member) => (
              <PremiumCard key={member.rank} className={member.rank === 1 ? "border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50" : ""}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-semibold
                      ${member.rank === 1 ? "bg-amber-100 text-amber-700" : 
                        member.rank === 2 ? "bg-slate-200 text-slate-700" : 
                        member.rank === 3 ? "bg-orange-100 text-orange-700" : 
                        "bg-slate-100 text-slate-600"}
                    `}>
                      #{member.rank}
                    </div>
                  </div>
                  <div className="text-2xl">{member.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      {member.rank === 1 && <Crown className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Level {member.level}</span>
                      <span>•</span>
                      <span>{member.badges} badges</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{member.points}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Recent Achievements */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Recent Achievements</h3>
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 border">
              3 new
            </Badge>
          </div>
          <div className="space-y-2.5">
            {recentBadges.map((badge) => (
              <PremiumCard key={badge.id}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${badge.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{badge.name}</h4>
                      <Badge className={`${getRarityBadge(badge.rarity)} border text-xs px-2 py-0.5 flex-shrink-0 capitalize`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{badge.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Earned by {badge.earnedBy}</span>
                      <span>•</span>
                      <span>{badge.earnedDate}</span>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* In Progress */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">In Progress</h3>
          <div className="space-y-2.5">
            {availableBadges.map((badge, index) => (
              <PremiumCard key={index}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${badge.bgColor} flex items-center justify-center flex-shrink-0 opacity-60`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{badge.name}</h4>
                      <Badge className={`${getRarityBadge(badge.rarity)} border text-xs px-2 py-0.5 flex-shrink-0 capitalize`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{badge.description}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-slate-600">
                      {badge.current} / {badge.target}
                    </span>
                    <span className="font-semibold text-slate-900">{badge.progress}%</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Motivational Card */}
        <section>
          <PremiumCard variant="primary" className="text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Amazing Teamwork!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your family has earned <span className="font-semibold text-slate-900">54 badges</span> together. Keep up the great work!
            </p>
          </PremiumCard>
        </section>
      </main>
    </div>
  );
}
