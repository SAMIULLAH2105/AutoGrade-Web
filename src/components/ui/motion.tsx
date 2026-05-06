import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type BaseDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  children: React.ReactNode;
};

export type FadeInProps = BaseDivProps & {
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.35,
  y = 12,
  scale = 0.99,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  const resolvedY = prefersReducedMotion ? 0 : y;
  const resolvedScale = prefersReducedMotion ? 1 : scale;
  const resolvedDuration = prefersReducedMotion ? 0.12 : duration;

  return (
    <motion.div
      initial={{ opacity: 0, y: resolvedY, scale: resolvedScale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: resolvedDuration, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type RevealProps = BaseDivProps & {
  once?: boolean;
  margin?: string;
  delay?: number;
  duration?: number;
  y?: number;
};

/**
 * Animates when scrolled into view.
 */
export function Reveal({
  children,
  className,
  once = true,
  margin = "-80px",
  delay = 0,
  duration = 0.4,
  y = 16,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const resolvedY = prefersReducedMotion ? 0 : y;
  const resolvedDuration = prefersReducedMotion ? 0.12 : duration;

  return (
    <motion.div
      initial={{ opacity: 0, y: resolvedY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ delay, duration: resolvedDuration, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type StaggerProps = BaseDivProps & {
  stagger?: number;
  delayChildren?: number;
};

export function Stagger({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0.04,
  ...props
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : stagger,
            delayChildren: prefersReducedMotion ? 0 : delayChildren,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type RevealStaggerProps = BaseDivProps & {
  once?: boolean;
  margin?: string;
  stagger?: number;
  delayChildren?: number;
};

/**
 * Staggers children when scrolled into view.
 * Pair this with `StaggerItem`.
 */
export function RevealStagger({
  children,
  className,
  once = true,
  margin = "-80px",
  stagger = 0.06,
  delayChildren = 0.04,
  ...props
}: RevealStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : stagger,
            delayChildren: prefersReducedMotion ? 0 : delayChildren,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type StaggerItemProps = BaseDivProps & {
  y?: number;
  duration?: number;
};

export function StaggerItem({
  children,
  className,
  y = 10,
  duration = 0.25,
  ...props
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const resolvedY = prefersReducedMotion ? 0 : y;
  const resolvedDuration = prefersReducedMotion ? 0.1 : duration;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: resolvedY },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: resolvedDuration, ease: "easeOut" },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
