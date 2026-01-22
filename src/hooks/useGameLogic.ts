/**
 * Re-export the new useGameAPILogic hook as useGameLogic
 * This maintains backward compatibility with existing components
 * while using the new usegamigameapi integration.
 */
export { useGameAPILogic as useGameLogic } from "./useGameAPILogic";
export type { GameState, GameActions } from "./useGameAPILogic";

