"use client";

import * as React from "react";
import { Button as ShadcnButton, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";

const MotionButton = motion(ShadcnButton);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => {
        const MotionApp = MotionButton as any;
        return (
            <MotionApp
                ref={ref}
                className={className}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
