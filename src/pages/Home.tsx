import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Zap,
  Shield,
  Users,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Home = () => {
  const features = [
    {
      icon: Code2,
      title: "Custom Development",
      description:
        "Tailored software solutions built to match your unique business requirements",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description:
        "Agile methodology ensures rapid development without compromising quality",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security and reliability you can trust for your business",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Experienced developers and designers dedicated to your success",
    },
  ];

  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "250+", label: "Happy Clients" },
    { value: "15+", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  const benefits = [
    "Transparent pricing with no hidden costs",
    "Flexible engagement models",
    "24/7 customer support",
    "Agile development process",
    "Quality assurance at every step",
    "Post-launch maintenance & support",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your Business with
              <span className="block mt-2 bg-gradient-hero bg-clip-text text-transparent">
                Innovative IT Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We deliver cutting-edge software development, cloud solutions, and
              managed IT services to help your business thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant text-lg px-8"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 transition-all hover:scale-105"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Takkiwebsolution?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine technical expertise with business acumen to deliver
              solutions that drive real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-hover transition-all duration-300 animate-scale-in border-border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-gradient-hero transition-colors">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What You Get with Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive solutions designed for your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card hover:shadow-elegant transition-all animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
            <CardContent className="relative p-12 text-center">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get a detailed cost estimate and timeline for your project. Our
                interactive calculator helps you plan your investment.
              </p>
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant text-lg px-8"
                >
                  Calculate Project Cost
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Takkiwebsolution. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
