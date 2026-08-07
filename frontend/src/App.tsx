import "./index.css";
import "./utilities.css";
import "./App.css";

import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "./api/apiClient";
import { authStore } from "./store/auth.store";
import { interviewStore } from "./store/interview.store";

import { SocialProof } from "./components/landingPage/SocialProof";
import { Hero } from "./components/landingPage/Hero";
import { Problem } from "./components/landingPage/Problem";
import { Solution } from "./components/landingPage/Solution";
import { HowItWorks } from "./components/landingPage/HowItWorks";
import { ProductShowcase } from "./components/landingPage/ProductShowcase";
import { FeatureGrid } from "./components/landingPage/FeatureGrid";
import { Analytics } from "./components/landingPage/Analytics";
import { QuestionReview } from "./components/landingPage/QuestionReview";
import { Testimonials } from "./components/landingPage/Testimonials";
import { Pricing } from "./components/landingPage/Pricing";
import { FAQ } from "./components/landingPage/FAQ";
import { FinalCTA } from "./components/landingPage/FinalCtal";
import { Footer } from "./components/landingPage/Footer";
import Navbar from "./components/landingPage/Navbar";

export default function App() {
  const setIsAuthenticated = authStore((s: any) => s.setIsAuthenticated);
  const setIsChecking = authStore((s: any) => s.setIsChecking);

  useEffect(() => {
    const unlock = () => {
      const audio = new Audio();

      audio.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAA..."; // tiny silent audio
      audio.play().catch(() => {});

      (interviewStore.getState() as any).setAudioUnlocked?.(true);

      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);

    return () => window.removeEventListener("click", unlock);
  }, []);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await apiClient.get("/api/auth/refresh");
        if (response.status == 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuthentication();
  }, []);
  return (
    <div>
      <Navbar />
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <HowItWorks />
      <ProductShowcase />
      <FeatureGrid />
      <Analytics />
      <QuestionReview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
