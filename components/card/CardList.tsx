import Card from "./Card";

interface CardListProps {
  cards: CardType[];
  onClick: (card: CardType) => void;
}

const CardList = ({ cards, onClick }: CardListProps) => {
  return (
    <div className="flex space-x-12">
      {cards.map((card) => {
        return (
          <div key={card} onClick={() => onClick(card)} >
            <Card type={card} isPlayer={true} />
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
