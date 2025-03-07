"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/utils/supabaseClient";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import supabase from "@/utils/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Function to check authentication and redirect if logged in
  const checkAuth = async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
      router.push("/home"); // Redirect if user is logged in
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for authentication state changes
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          router.push("/home");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Handle Google Sign-In
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col items-start justify-start pt-5 px-12">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#333333_1px,#121212_1px)] [background-size:16px_16px]"></div>

      <div className="w-full flex items-center justify-between px-4">
        <img src="/logo.svg" alt="logo" className="w-40 h-auto" />
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="font-semibold px-8"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="w-full h-full flex items-center justify-center gap-20">
        <Image src="/hero.avif" alt="hero" width={500} height={400} />
        <div className="flex flex-col items-start text-gray-100">
          <h1 className="font-semibold text-6xl bg-gradient-to-r from-[#00a884] to-[#02c26a] bg-clip-text text-transparent">
            Welcome to Periskope
          </h1>
          <p className="mt-4 text-xl">
            The only platform you need to automate your day-to-day <br />
            business on WhatsApp. Gain complete visibility and control <br />
            over your team's WhatsApp conversations.
          </p>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="mt-10 px-8 text-xl rounded-xl h-12 bg-gradient-to-r from-[#00a884] to-[#02c26a] hover:from-[#468267] hover:to-[#00a884] transition-all ease-in-out duration-300"
          >
            {loading ? "Signing in..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}
