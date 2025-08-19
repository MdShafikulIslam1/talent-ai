import { checkSubscription } from "@/lib/subscription";
import { getUserApiLimitCount } from "@/lib/userApiLimit";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobileSidebar";

const Navbar = async () => {
  const apiLimitCount = await getUserApiLimitCount();
    const isPro = await checkSubscription();
  
  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />

      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
