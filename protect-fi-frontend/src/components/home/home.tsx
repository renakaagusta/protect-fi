import React from "react";
import { Button } from "../button/button";
import Globe from "../ui/globe";
import ShimmerButton from "../ui/shimmer-button";
import AnimatedGradientText from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const HomePage = () => {
    const { theme } = useTheme();
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center py-8"
        
            // style={{
            //     boxShadow:
            //         theme === "dark"
            //             ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            //             : "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(0, 0, 0, 0.1) inset", // Adjust as needed
            // }}
        >
            {/* Left Section */}
            <LeftSection />

            {/* Right Section */}
            <RightSection />
        </div>
    );
};

export default HomePage;

// Components for the sections
const LeftSection = () => {
    return (
        <div className="w-full lg:w-3/5 text-center lg:text-left">
            <AnimatedGradientText>
                <h1
                    className={cn(
                        ``
                    )}
                >
                    The future of decentralized insurance with blockchain technology
                </h1>
            </AnimatedGradientText>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                Empowering users with trustless, transparent, and efficient insurance solutions through DeFi. Leveraging smart contracts on blockchain, our platform ensures secure, automated claim processing and full control over your policies—no intermediaries required.
            </p>
            <ShimmerButton className="mt-6 mx-auto lg:mx-0">
                <span className="whitespace-pre-wrap text-center text-sm sm:text-base md:text-lg font-medium tracking-tight text-white">
                    Explore More
                </span>
            </ShimmerButton>
        </div>
    );
};

const RightSection = () => {
    return (
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end items-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 lg:w-[35rem] md:h-96 relative flex justify-center items-center animate-float">
                <Globe />
            </div>
        </div>
    );
};
