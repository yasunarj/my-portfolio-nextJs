const MainHeader = ({ username }: { username: string }) => {
  return (
    <div>
      <h2 className="font-semibold  text-sm sm:text-xl text-gray-700 underline underline-offset-4">{`player: ${username}`}</h2>
    </div>
  );
};

export default MainHeader;
