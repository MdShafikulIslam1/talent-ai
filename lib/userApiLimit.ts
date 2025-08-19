import { MAX_FREE_COUNT } from "@/constant";
import { auth } from "@clerk/nextjs";
import { default as prisma } from "./prismadb";

export const increaseApiLimit = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });
  if (userApiLimit) {
    await prisma.userApiLimit.update({
      where: {
        userId,
      },
      data: {
        count: userApiLimit.count + 1,
      },
    });
  } else {
    await prisma.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNT) {
    return true;
  } else {
    return false;
  }
};

export const getUserApiLimitCount = async () => {
  const { userId } = auth();
  if (!userId) {
    return 0;
  }
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    return userApiLimit.count;
  } else {
    return 0;
  }
};
