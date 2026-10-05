import prisma from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log("[Stripe webhook] Bad signature:", error.message);
    return new NextResponse(error.message, {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) {
        return new NextResponse("User id is required", { status: 400 });
      }
      if (!session.subscription) {
        return new NextResponse(null, { status: 200 });
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const data = {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        StripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      };

      // Upsert so Stripe's retries (or a user re-subscribing) don't fail on the unique userId.
      await prisma.userSubscription.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      // Re-fetch the invoice so its shape matches our pinned API version,
      // whatever version the webhook endpoint sends events in.
      const invoice = await stripe.invoices.retrieve(
        (event.data.object as Stripe.Invoice).id
      );
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );

        // The first invoice often arrives before checkout.session.completed.
        // Then there is no row yet; the checkout handler saves the period end itself.
        await prisma.userSubscription.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            StripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
    }
  } catch (error) {
    console.log("[Stripe webhook] Failed to handle", event.type, error);
    // A 500 makes Stripe retry later.
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
