import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  HelpCircle, 
  Shield, 
  Palette,
  Users,
  Target,
  Crown,
  LogOut,
  ChevronRight,
  Mail,
  Info
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { PremiumCard } from "../components/PremiumCard";

export function SettingsScreen() {
  const settingsSections = [
    {
      title: "Account",
      items: [
        { 
          icon: Users, 
          label: "Profile", 
          description: "Manage your personal information",
          action: "navigate",
          badge: null
        },
        { 
          icon: Crown, 
          label: "Subscription", 
          description: "Premium • Family Plan",
          action: "navigate",
          badge: { text: "Active", variant: "success" }
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        { 
          icon: Bell, 
          label: "Notifications", 
          description: "Manage notification preferences",
          action: "toggle",
          value: true
        },
        { 
          icon: Moon, 
          label: "Dark Mode", 
          description: "Switch to dark theme",
          action: "toggle",
          value: false
        },
        { 
          icon: Globe, 
          label: "Language", 
          description: "English (US)",
          action: "navigate",
          badge: null
        },
      ],
    },
    {
      title: "Family Settings",
      items: [
        { 
          icon: Target, 
          label: "Goals Settings", 
          description: "Default settings for goals",
          action: "navigate",
          badge: null
        },
        { 
          icon: Palette, 
          label: "Customization", 
          description: "Themes, avatars, and preferences",
          action: "navigate",
          badge: null
        },
      ],
    },
    {
      title: "Security & Privacy",
      items: [
        { 
          icon: Lock, 
          label: "Privacy", 
          description: "Control your data and privacy",
          action: "navigate",
          badge: null
        },
        { 
          icon: Shield, 
          label: "Security", 
          description: "Password and authentication",
          action: "navigate",
          badge: null
        },
      ],
    },
    {
      title: "Support",
      items: [
        { 
          icon: HelpCircle, 
          label: "Help Center", 
          description: "FAQs and tutorials",
          action: "navigate",
          badge: null
        },
        { 
          icon: Mail, 
          label: "Contact Support", 
          description: "Get help from our team",
          action: "navigate",
          badge: null
        },
        { 
          icon: Info, 
          label: "About", 
          description: "Version 1.0.0",
          action: "navigate",
          badge: null
        },
      ],
    },
  ];

  const renderAction = (item: any) => {
    if (item.action === "toggle") {
      return <Switch checked={item.value} />;
    }
    if (item.badge) {
      const badgeVariants = {
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
      };
      return (
        <div className="flex items-center gap-2">
          <Badge className={`${badgeVariants[item.badge.variant as keyof typeof badgeVariants]} border text-xs px-2 py-0.5`}>
            {item.badge.text}
          </Badge>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      );
    }
    return <ChevronRight className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Settings" 
        subtitle="Manage your preferences"
      />

      <main className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {/* User Profile Card */}
        <section>
          <PremiumCard variant="primary">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl flex-shrink-0">
                👨
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-0.5">Robert Johnson</h3>
                <p className="text-sm text-slate-600 mb-2">robert.j@email.com</p>
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 border text-xs px-2 py-0.5 inline-flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Admin
                </Badge>
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="border-slate-200 hover:bg-slate-50"
              >
                Edit
              </Button>
            </div>
          </PremiumCard>
        </section>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <section key={sectionIndex}>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">{section.title}</h3>
            <PremiumCard className="divide-y divide-slate-100">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isToggle = item.action === "toggle";
                const Element = isToggle ? "div" : "button";
                
                return (
                  <Element
                    key={itemIndex}
                    className="w-full flex items-center gap-3 py-3 first:pt-0 last:pb-0 text-left hover:bg-slate-50 -mx-4 px-4 transition-colors"
                    {...(!isToggle && { type: "button" })}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm mb-0.5">{item.label}</p>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    </div>
                    {renderAction(item)}
                  </Element>
                );
              })}
            </PremiumCard>
          </section>
        ))}

        {/* Danger Zone */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Danger Zone</h3>
          <PremiumCard className="border-rose-200 bg-rose-50">
            <button className="w-full flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-rose-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-rose-900 text-sm mb-0.5">Sign Out</p>
                <p className="text-xs text-rose-700">Sign out from your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400" />
            </button>
          </PremiumCard>
        </section>

        {/* App Info */}
        <section className="text-center py-4">
          <p className="text-xs text-slate-500 mb-1">Family Productivity App</p>
          <p className="text-xs text-slate-400">Version 1.0.0 • Made with ❤️</p>
        </section>
      </main>
    </div>
  );
}