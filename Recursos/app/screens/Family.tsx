import { Plus, Crown, Shield, Eye, MoreVertical, Mail, Calendar, TrendingUp } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { IconBadge } from "../components/IconBadge";
import { PremiumCard } from "../components/PremiumCard";

export function FamilyScreen() {
  const familyMembers = [
    {
      name: "Robert Johnson",
      nickname: "Dad",
      avatar: "👨",
      email: "robert.j@email.com",
      role: "admin",
      roleLabel: "Admin",
      roleIcon: Crown,
      joinedDate: "Jan 2024",
      tasksCompleted: 127,
      goalsAchieved: 15,
      currentStreak: 12,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Sarah Johnson",
      nickname: "Mom",
      avatar: "👩",
      email: "sarah.j@email.com",
      role: "co-admin",
      roleLabel: "Co-Admin",
      roleIcon: Shield,
      joinedDate: "Jan 2024",
      tasksCompleted: 142,
      goalsAchieved: 18,
      currentStreak: 15,
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
    {
      name: "Emma Johnson",
      nickname: "Emma",
      avatar: "👧",
      email: "emma.j@email.com",
      role: "member",
      roleLabel: "Member",
      roleIcon: Shield,
      joinedDate: "Jan 2024",
      tasksCompleted: 89,
      goalsAchieved: 10,
      currentStreak: 8,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Jake Johnson",
      nickname: "Jake",
      avatar: "👦",
      email: "jake.j@email.com",
      role: "member",
      roleLabel: "Member",
      roleIcon: Shield,
      joinedDate: "Jan 2024",
      tasksCompleted: 67,
      goalsAchieved: 7,
      currentStreak: 5,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  const roleColors = {
    admin: { badge: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "text-indigo-600" },
    "co-admin": { badge: "bg-purple-100 text-purple-700 border-purple-200", icon: "text-purple-600" },
    member: { badge: "bg-slate-100 text-slate-700 border-slate-200", icon: "text-slate-600" },
    viewer: { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: "text-amber-600" },
  };

  const pendingInvites = [
    { email: "grandma@email.com", role: "viewer", sentDate: "2 days ago" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Family" 
        subtitle="4 members"
        action={
          <Button 
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-lg"
          >
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Invite
          </Button>
        }
      />

      <main className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {/* Family Overview */}
        <section>
          <PremiumCard variant="primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Johnson Family</h3>
                <p className="text-sm text-slate-600">Est. January 2024</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-indigo-100">
              <div>
                <p className="text-2xl font-semibold text-slate-900 mb-0.5">425</p>
                <p className="text-xs text-slate-500">Total Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900 mb-0.5">50</p>
                <p className="text-xs text-slate-500">Goals</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900 mb-0.5">15</p>
                <p className="text-xs text-slate-500">Avg Streak</p>
              </div>
            </div>
          </PremiumCard>
        </section>

        {/* Family Members */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Members</h3>
          <div className="space-y-3">
            {familyMembers.map((member) => {
              const RoleIcon = member.roleIcon;
              const roleStyle = roleColors[member.role as keyof typeof roleColors];
              
              return (
                <PremiumCard key={member.email} className="relative overflow-hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-xl ${member.bgColor} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{member.name}</h4>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 -mt-1 -mr-2 hover:bg-slate-100 text-slate-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${roleStyle.badge} border text-xs px-2 py-0.5 flex items-center gap-1`}>
                          <RoleIcon className="w-3 h-3" />
                          {member.roleLabel}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {member.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-0.5">{member.tasksCompleted}</p>
                      <p className="text-xs text-slate-500">Tasks</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-0.5">{member.goalsAchieved}</p>
                      <p className="text-xs text-slate-500">Goals</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-0.5">{member.currentStreak}</p>
                      <p className="text-xs text-slate-500">Streak</p>
                    </div>
                  </div>
                </PremiumCard>
              );
            })}
          </div>
        </section>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Pending Invites</h3>
            <div className="space-y-2.5">
              {pendingInvites.map((invite, index) => (
                <PremiumCard key={index}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{invite.email}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 border px-2 py-0.5 capitalize">
                          {invite.role}
                        </Badge>
                        <span>•</span>
                        <span>Sent {invite.sentDate}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs border-slate-200 hover:bg-slate-50"
                    >
                      Resend
                    </Button>
                  </div>
                </PremiumCard>
              ))}
            </div>
          </section>
        )}

        {/* Roles Info */}
        <section>
          <PremiumCard className="bg-slate-50">
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Role Permissions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Crown className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Admin</p>
                  <p className="text-xs text-slate-600">Full control over family settings, members, and data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Co-Admin</p>
                  <p className="text-xs text-slate-600">Can manage tasks, goals, and view all data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Member</p>
                  <p className="text-xs text-slate-600">Can create and complete tasks and goals</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Viewer</p>
                  <p className="text-xs text-slate-600">Can only view family activity (read-only)</p>
                </div>
              </div>
            </div>
          </PremiumCard>
        </section>
      </main>
    </div>
  );
}
