const determineWinner = (
  playerCard: CardType,
  cpuCard: CardType
): "win" | "lose" | "draw" => {
  if(playerCard === cpuCard) return "draw";
  if (
    (playerCard === "rock" && cpuCard === "scissors") ||
    (playerCard === "scissors" && cpuCard === "paper") ||
    (playerCard === "paper" && cpuCard === "rock")
  ) {
    return "win";
  }
  return "lose";
};

export { determineWinner };
