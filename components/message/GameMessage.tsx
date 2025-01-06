const GameMessage = ({ guideMessage }: { guideMessage: string }) => {
  return (
    <p className="absolute  top-[48%] right-16 font-semibold hidden text-sm sm:block sm:text-sm md:text-xl text-gray-700">
        {guideMessage}
    </p>
  );
};

export default GameMessage;