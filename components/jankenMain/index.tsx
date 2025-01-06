"use client";
import useJankenGame from "@/hooks/useJankenGame";
import Card from "../card/Card";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import CardList from "../card/CardList";
import GameMessage from "../message/GameMessage";

const choicesCard: CardType[] = ["rock", "scissors", "paper"];

const JankenMain = () => {
  const {
    cpuCard,
    guideMessage,
    selectCard,
    isSelected,
    isFinished,
    reset,
    setIsFinished,
    handlePlayerCard,
    handleSelectCard,
  } = useJankenGame();
  return (
    <div className="flex flex-col items-center justify-between h-[90%] w-full bg-gray-300 py-4 relative">
      <div className="flex flex-col gap-6 items-center">
        <div className="flex space-x-12">
          <Card type="back" />
          <Card type="back" />
          <Card type="back" />
        </div>
        <div>
          {isSelected ? (
            isFinished ? (
              <Card type={cpuCard!} />
            ) : (
              <Card type="back" />
            )
          ) : (
            <div className="border-4 border-dotted rounded-lg p-4 w-20 h-24 flex items-center justify-center text-6xl select-none bg-gray-400"></div>
          )}
        </div>
      </div>

      <div>
        {isSelected &&
          (isFinished ? (
            <Button
              className={cn(
                buttonVariants({ variant: "destructive", size: "lg" }),
                "my-4"
              )}
              onClick={() => {
                reset();
              }}
            >
              もう一度
            </Button>
          ) : (
            <Button
              className={cn(
                buttonVariants({ variant: "destructive", size: "lg" }),
                "my-4"
              )}
              onClick={() => {
                setIsFinished(true);
                handlePlayerCard(selectCard!);
              }}
            >
              勝負！！
            </Button>
          ))}
      </div>

      <GameMessage guideMessage={guideMessage} />

      <div className="flex flex-col items-center gap-6">
        <div>
          {selectCard ? (
            <Card type={selectCard} />
          ) : (
            <div className="border-4 border-dotted rounded-lg p-4 w-20 h-24 flex items-center justify-center text-6xl select-none bg-gray-400"></div>
          )}
        </div>
        <CardList cards={choicesCard} onClick={handleSelectCard} />
      </div>
    </div>
  );
};

export default JankenMain;
