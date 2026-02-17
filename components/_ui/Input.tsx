"use client";

import * as React from "react";
import { Input as ShadcnInput, InputProps } from "@/components/ui/input";
import { motion } from "framer-motion";

const MotionInput = motion(ShadcnInput);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <MotionInput
                ref={ref}
                className={className}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileFocus={{ scale: 1.01, borderColor: "var(--primary)" }}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
