/**
 * FamilyHub - App principal con navegación de 5 tabs (WEB)
 * Wrapper que maneja la navegación interna entre Home, Plan, Family, House, More
 */

import { useState } from "react";
import { BottomNavigation, TabId } from "@/components/familyhub/BottomNavigation";
import Home from "./home.web";
import Plan from "./plan.web";
import Family from "./family.web";
import House from "./house.web";
import More from "./more.web";

export default function FamilyHubApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const handleNavigate = (tab: string, route?: string) => {
    setActiveTab(tab as TabId);
  };

  const handlePlanNavigate = (route: string) => {
    // Handle sub-routes if needed
  };

  const handleHouseNavigate = (route: string) => {
    // Handle sub-routes if needed
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'plan':
        return <Plan onNavigate={handlePlanNavigate} />;
      case 'family':
        return <Family />;
      case 'house':
        return <House onNavigate={handleHouseNavigate} />;
      case 'more':
        return <More />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
