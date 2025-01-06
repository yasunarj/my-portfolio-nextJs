interface CardProps {
  type: CardType | "back";
  isSelected?: boolean;
  isPlayer?: boolean
}
const Card = ({ type, isPlayer }: CardProps) => {
  const getCardContent = () => {
    switch (type) {
      case "rock":
        return "👊";
      case "scissors":
        return "✌️";
      case "paper":
        return "🖐️";
      case "back":
      default:
        return "🎩";
    }
  };

  return (
    <div
      className={`border-2 ${isPlayer && "hover:border-blue-400" }  rounded-lg p-4 w-24 h-32 flex items-center justify-center text-6xl select-none ${ type === "back" ? "bg-gray-400" : "bg-white"
      } `}
    >
      {getCardContent()}
    </div>
  );
};

export default Card;
