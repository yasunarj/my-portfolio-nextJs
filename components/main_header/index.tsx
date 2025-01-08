const MainHeader = ({ username }: { username: string }) => {
  return (
    <div>
      <h2 className="font-semibold text-white text-center text-sm sm:text-xl underline underline-offset-4">{`player: ${username}`}</h2>
    </div>
  );
};

export default MainHeader;
