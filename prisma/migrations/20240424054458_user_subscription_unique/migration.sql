/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_stripe_customer_id_key" ON "UserSubscription"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_stripe_subscription_id_key" ON "UserSubscription"("stripe_subscription_id");
