const GameMessage = ({ guideMessage }: { guideMessage: string }) => {
  return (
    <p className="absolute top-[48%] right-8 text-xl font-semibold text-white" style={{ fontFamily: "fantasy" }}>
        {guideMessage}
    </p>
  );
};

export default GameMessage;