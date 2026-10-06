import React, { useState } from "react";

import Background from "./components/Background/Background";
import Header from "./components/Header/Header";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";

import Mine from "./modules/mine/Mine";
import Boost from "./modules/boost/Boost";
import Tasks from "./modules/tasks/Tasks";
import Friends from "./modules/friends/Friends";
import Swap from "./modules/swap/Swap";
import Wallet from "./modules/wallet/Wallet";

const App = () => {
  const [activePage, setActivePage] = useState("Mine");

  const renderPage = () => {
    switch (activePage) {
      case "Mine":
        return <Mine />;

      case "Boost":
        return <Boost />;

      case "Tasks":
        return <Tasks />;

      case "Friends":
        return <Friends />;

      case "Swap":
        return <Swap />;

      case "Wallet":
        return <Wallet />;

      default:
        return <Mine />;
    }
  };

  return (
    <Background>
      <Header
        title="SNJ Mining"
        subtitle="Earn • Mine • Grow"
        notificationCount={0}
        onNotificationClick={() => {
          console.log("Notifications clicked");
        }}
      />

      {renderPage()}

      <BottomNavigation
        activePage={activePage}
        onChange={setActivePage}
      />
    </Background>
  );
};

export default App;
