import { MotionProps } from "framer-motion";

export type MotionComponentProps<T extends React.ElementType> =
    React.ComponentPropsWithoutRef<T> & MotionProps;
