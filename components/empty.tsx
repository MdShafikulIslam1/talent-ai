import Image from "next/image";

interface EmptyProps {
  title: string;
}

const Empty = ({ title }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col justify-center items-center">
      <div className="relative w-72 h-72">
        <Image fill alt="empty" src={"/empty.jpg"} />
      </div>
      <p className="text-muted-foreground text-sm text-center">{title}</p>
    </div>
  );
};

export default Empty;
