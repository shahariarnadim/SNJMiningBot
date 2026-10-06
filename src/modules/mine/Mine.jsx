import React, { useState } from "react";

import SNJCoin from "../../components/SNJCoin/SNJCoin";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import StatusCard from "../../components/StatusCard/StatusCard";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import MiningProgress from "../../components/MiningProgress/MiningProgress";
import MiningHistory from "../../components/MiningHistory/MiningHistory";

const Mine = () => {
  const [miningActive, setMiningActive] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartMining = () => {
    setMiningActive(true);
    setCanClaim(false);
    setProgress(0);
  };

  const handleClaim = () => {
    setMiningActive(false);
    setCanClaim(false);
    setProgress(0);
  };

  const handleWatchAd = () => {
    // Ad provider will be connected later.
    console.log("Watch Ad 2x");
  };

  return (
    <main className="min-h-screen pb-24">
      {/* Balance */}
      <BalanceCard
        snjBalance={0}
        nTokenBalance={0}
        dollarBalance={0}
      />

      {/* Coin */}
      <div className="flex justify-center py-3">
        <SNJCoin size={180} />
      </div>

      {/* Mining Status */}
      <StatusCard
        miningActive={miningActive}
        miningRate={0}
        remainingTime="04:00:00"
      />

      {/* Progress */}
      <MiningProgress
        progress={progress}
        duration="4 Hours"
      />

      {/* Actions */}
      <ActionButtons
        miningActive={miningActive}
        canClaim={canClaim}
        onStartMining={handleStartMining}
        onClaim={handleClaim}
        onWatchAd={handleWatchAd}
      />

      {/* History */}
      <MiningHistory
        history={[]}
        onViewAll={() => {
          console.log("View all mining history");
        }}
      />
    </main>
  );
};

export default Mine;
