// hooks
import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/context/game/GameContext";
import { useLogGameState } from "@/utils/logging.util";

// components
import GameBoard from "@/components/game/GameBoard";
import HUD from "@/components/game/HUD";
import BackButton from "@/components/game/BackButton";
import MenuButtons from "@/components/game/MenuButtons";
import GameOutcomeModal from "@/components/game/GameOutcomeModal";
import UnitPanel from "@/components/game/UnitPanel";

// utils
import { botChooseActions } from "@/engine/bots/index";

// types
import type { Tile } from "@/types/tile";
import type { GameAction } from "@/types/action";

// styles
import classes from "./GameView.module.scss";

const GameView = () => {
  const { state, units, currentPlayer, outcome, dispatch } = useGame();
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  useLogGameState(state);

  const activeUnitId = activeTile?.occupantId;

  const activeUnit = useMemo(() => {
    if (!activeUnitId) return null;
    const unit = units.get(activeUnitId);
    return unit?.ownerId === currentPlayer.id ? unit : null;
  }, [activeTile, units, currentPlayer]);

  useEffect(() => {
    if (currentPlayer.type === "human" || outcome.status === "finished") return;

    let cancelled = false;

    const runBotAction = async (action: GameAction) => {
      if (cancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(action);
    };

    const runBotTurn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentPlayer.type === "human") return;

      const botActions = botChooseActions(state, currentPlayer.type);

      for (let i = 0; i < botActions.length; i++) {
        await runBotAction(botActions[i]);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!cancelled) {
        dispatch({ type: "advance", payload: {} });
      }
    };

    runBotTurn();

    return () => {
      cancelled = true;
    };
  }, [currentPlayer]);

  return (
    <div className={classes.layout}>
      <div className={classes.backButtonContainer}>
        <BackButton />
      </div>
      <div className={classes.HUDContainer}>
        <HUD />
      </div>
      <div className={classes.menuContainer}>
        <MenuButtons />
      </div>
      <div className={classes.boardContainer}>
        <GameBoard activeTile={activeTile} setActiveTile={setActiveTile} />
      </div>
      <div className={classes.leftPanel}>
        {activeUnit && <UnitPanel unit={activeUnit} />}
      </div>
      {outcome.status === "finished" && <GameOutcomeModal />}
    </div>
  );
};

export default GameView;
