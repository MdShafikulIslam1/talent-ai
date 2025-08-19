import GridLoader from "react-spinners/GridLoader";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-y-4">
      <GridLoader color="#7F00FF" loading={isLoading} />
      {/* <div className="w-8 h-8 relative animate-spin">
        <Image fill alt="loading..." src={"/logo.png"} />
      </div> */}
      <p className="text-muted-foreground text-sm">
        Talent Ai is thinking ....
      </p>
    </div>
  );
};

export default Loader;
