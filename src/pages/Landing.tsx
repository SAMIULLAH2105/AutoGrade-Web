import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Reveal, RevealStagger, StaggerItem } from "@/components/ui/motion";

const features = [
  {
    icon: Clock,
    title: "Instant Results",
    description:
      "Get your paper checked within seconds using our advanced AI technology.",
  },
  {
    icon: CheckCircle2,
    title: "Accurate Marking",
    description:
      "Our AI is trained on thousands of exam papers for precise evaluation.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your papers are encrypted and never shared with third parties.",
  },
  {
    icon: Sparkles,
    title: "Detailed Feedback",
    description: "Receive comprehensive feedback with improvement suggestions.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload Your Paper",
    description:
      "Simply drag and drop your exam paper in PDF, JPG, or PNG format.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Processing",
    description:
      "Our intelligent system analyzes your answers against marking schemes.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Get Results",
    description: "Receive detailed marks breakdown and personalized feedback.",
    icon: CheckCircle2,
  },
];

const testimonials = [
  {
    name: "Samiullah ",
    role: "A Level Student",
    content:
      "PaperCheck helped me identify my weak areas before the actual exam. My grades improved significantly!",
    avatar: "S",
  },
  {
    name: "Faez Ansar",
    role: "Physics Tutor",
    content:
      "As a tutor, this tool saves me hours of marking time. The feedback quality is exceptional.",
    avatar: "D",
  },
  {
    name: "Jhanzaib Habib",
    role: "O Level Student",
    content:
      "The instant feedback helped me understand where I was losing marks. Highly recommended!",
    avatar: "A",
  },
  {
    name: "Muneeb Masood",
    role: "O Level Student",
    content:
      "The instant feedback helped me understand where I was losing marks. Highly recommended!",
    avatar: "A",
  },
];

const stats = [
  { value: "5+", label: "Papers Checked" },
  { value: "90%", label: "Accuracy Rate" },
  { value: "5+", label: "Active Users" },
  { value: "24/7", label: "Available" },
];

export default function Landing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container-custom relative ">
          <div className="section-padding flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Paper Checking
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
            >
              Instant O & A Level{" "}
              <span className="gradient-text">Paper Checking</span> Powered by
              AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance"
            >
              Upload your exam papers and get instant, accurate feedback.
              Perfect for students preparing for exams and tutors streamlining
              their workflow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to="/upload">
                <Button variant="hero" size="xl" className="group">
                  <Upload className="w-5 h-5" />
                  Upload Paper
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero-outline" size="xl">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-3xl sm:text-4xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background section-padding">
        <div className="container-custom">
          <Reveal className="text-center mb-16" margin="-100px">
            <span className="text-primary font-medium">Simple Process</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your papers checked and receive
              comprehensive feedback.
            </p>
          </Reveal>

          <RevealStagger className="grid md:grid-cols-3 gap-8" margin="-100px">
            {howItWorks.map((item, index) => (
              <StaggerItem
                key={index}
                className="relative glass-card-hover p-8 text-center"
              >
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:flex items-center absolute top-1/2 -right-6">
                    <div className="w-8 border-t-2 border-y-3 border-gray-600"></div>
                    <div className="w-3 h-3 border-t-4 border-r-4 border-purple-500 rotate-45 -ml-1"></div>
                  </div>
                )}

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg text-primary-foreground mb-6 shadow-lg shadow-primary/25">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="font-display text-sm text-primary font-semibold mb-2">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 section-padding">
        <div className="container-custom">
          <Reveal className="text-center mb-16" margin="-100px">
            <span className="text-primary font-medium">Why Choose Us</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
              Powerful Features
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your O & A Level exams.
            </p>
          </Reveal>

          <RevealStagger
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            margin="-100px"
          >
            {features.map((feature, index) => (
              <StaggerItem
                key={index}
                className="glass-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-background section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal margin="-100px">
              <span className="text-primary font-medium">Who It's For</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-6">
                Built for Students & Tutors
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you're a student preparing for exams or a tutor looking
                to streamline your marking process, PaperCheck has you covered.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex-shrink-0 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">
                      For Students
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Practice with past papers and get instant feedback to
                      identify areas for improvement before your exams.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">
                      For Tutors
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Save hours of marking time while providing your students
                      with detailed, consistent feedback.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-2 gap-4" margin="-100px" delay={0.06}>
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-2xl">
                  <Users className="w-8 h-8 text-primary mb-3" />
                  <div className="font-display text-2xl font-bold">5+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Students
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl bg-primary text-primary-foreground">
                  <Star className="w-8 h-8 mb-3" />
                  <div className="font-display text-2xl font-bold">4.5/5</div>
                  <div className="text-sm opacity-80">User Rating</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="glass-card p-6 rounded-2xl bg-accent text-accent-foreground">
                  <CheckCircle2 className="w-8 h-8 mb-3" />
                  <div className="font-display text-2xl font-bold">50+</div>
                  <div className="text-sm opacity-80">Papers Checked</div>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <div className="font-display text-2xl font-bold">&lt;45s</div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Check Time
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 section-padding">
        <div className="container-custom">
          <Reveal className="text-center mb-16" margin="-100px">
            <span className="text-primary font-medium">Testimonials</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
              What Our Users Say
            </h2>
          </Reveal>

          <RevealStagger className="grid md:grid-cols-3 gap-6" margin="-100px">
            {testimonials.map((testimonial, index) => (
              <StaggerItem
                key={index}
                className="glass-card-hover p-6"
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background section-padding">
        <div className="container-custom">
          <Reveal
            y={30}
            duration={0.6}
            className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 lg:p-16 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Ready to Ace Your Exams?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of students and tutors already using PaperCheck
                to improve their exam performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload">
                  <Button
                    size="xl"
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Your First Paper
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
