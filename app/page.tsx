import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Home = () => {
  return (
    <div className="flex-grow flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/images/photo-1711560217827-dbcb4de4e35d.avif')" }}> 
      <div className="flex-grow flex flex-col items-center justify-center space-y-8 h-[80%]">
        <h1 className="text-4xl font-bold tracking-wider text-white" style={{ fontFamily: "fantasy" }}>
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
      </div>Ï
    </div>
  );
};

export default Home;
