import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCpuCard,
  setGuideMessage,
  incrementPoint,
  decrementPoint,
  resetGame,
} from "@/redux/slices/jankenSlice";
import { RootState } from "@/redux/store";
import { determineWinner } from "@/lib/jankenLogic";

const useJankenGame = () => {
  const { guideMessage, cpuCard, point } = useSelector(
    (state: RootState) => state.janken
  );
  const dispatch = useDispatch();

  const [selectCard, setSelectCard] = useState<CardType | null>(null);
  const [isSelected, isSetSelected] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const handlePlayerCard = (playerCard: CardType) => {
    if(!playerCard || !cpuCard) {
      return;
    }
    const result = determineWinner(playerCard, cpuCard);
    if(result === "win") {
      dispatch(setGuideMessage("Win!"));
      dispatch(incrementPoint(10));
    } else if (result === "lose") {
      if(point === 0) {
        dispatch(setGuideMessage("lose..."));
        return;
      }
      dispatch(setGuideMessage("lose..."));
      dispatch(decrementPoint(10));
    } else {
      dispatch(setGuideMessage("again!"));
    }
  };

  const handleSelectCard = (type: CardType) => {
    if(isSelected) {
      return;
    }
    setSelectCard(type);
    setTimeout(() => {
      isSetSelected(true);
      dispatch(setCpuCard());
    }, 1000);
  }

  const reset = () => {
    setSelectCard(null);
    isSetSelected(false);
    setIsFinished(false);
    dispatch(resetGame());
  }

  return {
    cpuCard,
    point,
    guideMessage,
    selectCard,
    isSelected,
    isFinished,
    setIsFinished,
    handlePlayerCard,
    handleSelectCard,
    reset,
  }
};

export default useJankenGame;
