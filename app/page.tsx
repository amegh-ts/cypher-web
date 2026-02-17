"use client";

import Link from "next/link";
import { Button } from "@/components/_ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tighter">Cypher</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Control Your Bot Empire
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The ultimate admin panel for managing users, files, and analytics
              for your Telegram bots. Secure, fast, and beautiful.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 min-[400px]:flex-row"
          >
            <Link href="/login">
              <Button size="lg" className="h-12 px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/amegh-ts/cypher-web" target="_blank">
              <Button variant="outline" size="lg" className="h-12 px-8">
                View on GitHub
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container space-y-12 py-12 md:py-24 lg:py-32"
        >
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="grid gap-1 rounded-lg border p-6 shadow-sm"
            >
              <BarChart2 className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-bold">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your bot's performance, user growth, and file distribution
                in real-time.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="grid gap-1 rounded-lg border p-6 shadow-sm"
            >
              <Users className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-bold">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Easily manage bot users, admins, and permissions with a powerful
                data table.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="grid gap-1 rounded-lg border p-6 shadow-sm"
            >
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-bold">Fast & Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Built with Next.js 16 and MongoDB for lightning-fast data
                retrieval and updates.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Cypher Team. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-sm text-muted-foreground hover:underline"
              href="#"
            >
              Terms
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:underline"
              href="#"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
