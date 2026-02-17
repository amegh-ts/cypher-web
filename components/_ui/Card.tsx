"use client";

import * as React from "react";
import {
    Card as ShadcnCard,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const MotionCard = motion(ShadcnCard);

const Card = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof ShadcnCard>
>(({ className, ...props }, ref) => (
    <MotionCard
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={className}
        {...props}
    />
));
Card.displayName = "Card";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};
