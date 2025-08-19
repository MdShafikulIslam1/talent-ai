import { auth } from "@clerk/nextjs";
import prisma from "./prismadb";

const DAY_IN_MS = 84_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }
  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
      StripePriceId: true,
      stripeCustomerId: true,
    },
  });

  // console.log("user subscription", userSubscription);

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.StripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
  return !!isValid;
};
