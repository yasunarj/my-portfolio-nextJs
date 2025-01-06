import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Home = () => {
  return (
    <div className="h-screen-vh">
      <div className="flex flex-col items-center justify-center space-y-8 h-[80%]">
        <h1 className="text-4xl font-bold text-gray-700 tracking-wider">
          🚀Next Game🚀
        </h1>
        <Link href="/game">
          <Button
            className={cn(
              buttonVariants({ variant: "default" }),
              "font-semibold text-xl"
            )}
          >
            Game Start
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
