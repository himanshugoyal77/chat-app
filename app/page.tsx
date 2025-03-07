"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/utils/supabaseClient";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  }, [router]);

  // Handle Google Sign-In
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `https://periskope-chat-app.vercel.app/home` },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-start justify-start pt-5 px-4 md:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#333333_1px,#121212_1px)] [background-size:16px_16px]"></div>

      {/* Header */}
      <div className="w-full flex items-center justify-between px-2 md:px-4">
        <img src="/logo.svg" alt="logo" className="w-28 md:w-40 h-auto" />
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="font-semibold px-4 md:px-8 text-sm md:text-base cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      {/* Main content */}
      <div className="w-full flex-1 flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-20 py-10">
        {/* Hero image - hidden on very small screens, visible from sm breakpoint */}
        <div className="w-full md:w-auto flex justify-center">
          <Image
            src="/hero.avif"
            alt="hero"
            width={500}
            height={400}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
            priority
          />
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center md:items-start text-gray-100 px-4 text-center md:text-left">
          <h1 className="font-semibold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#00a884] to-[#02c26a] bg-clip-text text-transparent">
            Welcome to Periskope
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl">
            The only platform you need to automate your day-to-day{" "}
            <br className="hidden md:block" />
            business on WhatsApp. Gain complete visibility and control{" "}
            <br className="hidden md:block" />
            over your team's WhatsApp conversations.
          </p>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 md:mt-10 cursor-pointer px-6 md:px-8 text-base md:text-xl rounded-xl h-10 md:h-12 bg-gradient-to-r from-[#00a884] to-[#02c26a] hover:from-[#468267] hover:to-[#00a884] transition-all ease-in-out duration-300"
          >
            {loading ? "Signing in..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}
