import React from "react";
import Heading from "@/components/landing/heading";
import HeroSection from "@/components/landing/hero-section";
import Footer from "@/components/landing/footer";

const HomePage = () => {
  return (
    <section className="min-h-full flex flex-col">
      <div className="h-full flex flex-col items-center justify-center md:justify-start text-center gap-y-8 px-6 pb-10 flex-1">
        <Heading />
        <HeroSection />
      </div>
      <Footer />
    </section>
  );
};

export default HomePage;
