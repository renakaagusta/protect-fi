'use client';

import ERC20ABI from "@/abis/tokens/ERC20ABI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/dialog";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";
// import HomePage from "@/components/home/home";
import Globe from "@/components/ui/globe";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import ShimmerButton from "@/components/ui/shimmer-button";
import ClientWrapper from "@/components/wrapper/client-wrapper";
import { wagmiConfig } from "@/configs/wagmi";
import { FAUCET_ADDRESS } from "@/constants/contract-address";
import { FAUCET_SUBGRAPH_URL } from "@/constants/subgraph-url";
import { queryAddTokens, queryRequestTokens } from "@/graphql/faucet/faucet.query";
import { useFaucetCooldown } from "@/hooks/web3/faucet/useFaucetCooldown";
import { useLastRequestTime } from "@/hooks/web3/faucet/useLastRequestTime";
import { useRequestToken } from "@/hooks/web3/faucet/useRequestToken";
import { useBalance } from "@/hooks/web3/token/useBalance";
import { cn } from "@/lib/utils";
import { AddTokensData } from "@/types/web3/faucet/add-token";
import { RequestTokensData } from "@/types/web3/faucet/request-token";
import { HexAddress } from "@/types/web3/general/address";
import { Token } from "@/types/web3/tokens/token";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { request } from 'graphql-request';
import { Building, Scale, Wallet } from "lucide-react";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { arbitrum } from "viem/chains";
import {
  useAccount
} from "wagmi";
import * as z from "zod";

const faucetSchema = z.object({
  token: z.string().min(1),
});

const Home: NextPage = () => {
  const form = useForm<z.infer<typeof faucetSchema>>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      token: "",
    },
  });
  const { watch } = form;
  const selectedTokenAddress = watch("token");

  const { address: userAddress, isConnected } = useAccount();

  const [availableTokens, setAvailableTokens] = useState<Record<string, Token>>({});

  const { balance: userBalance, error: userBalanceError } = useBalance(userAddress as HexAddress, selectedTokenAddress as HexAddress);
  const { balance: faucetBalance, error: faucetBalanceError } = useBalance(FAUCET_ADDRESS as HexAddress, selectedTokenAddress as HexAddress);
  const { lastRequestTime, error: lastRequestTimeError } = useLastRequestTime(userAddress as HexAddress, FAUCET_ADDRESS);
  const { faucetCooldown, error: faucetCooldownError } = useFaucetCooldown(FAUCET_ADDRESS);
  const {
    isPurchasePolicyAlertOpen: isAlertRequestTokenOpen,
    handleRequestToken
  } = useRequestToken();

  const { data: addTokensData, isLoading: addTokensIsLoading, refetch: addTokensRefetch } = useQuery<AddTokensData>({
    queryKey: ['addTokensData'],
    queryFn: async () => {
      return await request(FAUCET_SUBGRAPH_URL, queryAddTokens);
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const { data: requestTokensData, isLoading: requestTokensIsLoading, refetch: requestTokensRefetch } = useQuery<RequestTokensData>({
    queryKey: ['requestTokensData'],
    queryFn: async () => {
      return await request(FAUCET_SUBGRAPH_URL, queryRequestTokens);
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const onSubmit = async (values: z.infer<typeof faucetSchema>) => {
    handleRequestToken(userAddress as HexAddress, selectedTokenAddress as HexAddress);
  };

  useEffect(() => {
    if (!addTokensData) {
      return;
    }

    const fetchTokensData = async () => {
      const availableTokens: Record<string, Token> = {}

      await Promise.all(addTokensData.addTokens.map(async (addTokenData) => {
        let tokenName = '';
        let tokenSymbol = '';

        try {
          const tokenNameResult = await readContract(wagmiConfig, {
            address: addTokenData.token,
            abi: ERC20ABI,
            functionName: 'name',
            args: [],
          });

          const tokenSymbolResult = await readContract(wagmiConfig, {
            address: addTokenData.token,
            abi: ERC20ABI,
            functionName: 'symbol',
            args: [],
          });

          tokenName = tokenNameResult as string;
          tokenSymbol = tokenSymbolResult as string;
        } catch (err: unknown) {
          console.log('Error fetching token name of', addTokenData.token, err);
        }

        availableTokens[addTokenData.token] = {
          address: addTokenData.token,
          name: tokenName,
          symbol: tokenSymbol,
        };
      }))

      setAvailableTokens(availableTokens);
    }

    fetchTokensData();
  }, [addTokensData])

  const rolesData = [
    {
      id: 1,
      title: "Insurance Provider",
      description: "Provide capital to insurance pools and earn rewards through premium sharing.",
      iconBackground: "bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 dark:from-[#4393F5] dark:via-[#0B2545] dark:to-[#13315C]",
      iconColor: "texy-white",
      image: "/database.png", // Path to the image in public folder
      points: [
        "Stake assets in coverage pools",
        "Earn premium yields",
        "Participate in risk assessment",
      ],
    },
    {
      id: 2,
      title: "Custodian",
      description: "Manage and secure insurance funds through multi-signature smart contracts.",
      iconBackground: "bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 dark:from-[#4393F5] dark:via-[#0B2545] dark:to-[#13315C]",
      iconColor: "texy-white",
      image: "/party.png", // Path to the image in public folder
      points: [
        "Secure fund management",
        "Execute validated payouts",
        "Monitor pool health",
      ],
    },
    {
      id: 3,
      title: "Claim Assessor",
      description: "Validate and process insurance claims using on-chain data and smart contracts.",
      iconBackground: "bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 dark:from-[#4393F5] dark:via-[#0B2545] dark:to-[#13315C]",
      iconColor: "texy-white",
      image: "/tax.png", // Path to the image in public folder
      points: [
        "Review claim evidence",
        "Verify on-chain events",
        "Vote on claim decisions",
      ],
    },
  ];


  return (
    <main>
      <ClientWrapper>
        {/* Hero Section */}
        <div className="w-full max-w-screen-2xl min-h-[calc(100vh-80px)] bg-cover bg-center text-gray-900 dark:text-white flex items-center justify-center px-4 py-6 sm:p-8 lg:p-12">
          <div className="w-full mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Section */}
            <LeftSection />
            {/* Right Section - Hidden on mobile */}
            <RightSection />
          </div>
        </div>

        {/* See Insurance Reimagined Section */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <AnimatedGradientText>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold inline animate-gradient bg-gradient-to-r from-[#4facfe] via-[#1e3a8a] to-[#4facfe] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                  See insurance reimagined
                </span>
              </AnimatedGradientText>
            </div>
            <p className="text-neutral-700 dark:text-neutral-200 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              See how blockchain technology transforms traditional insurance into a transparent, efficient, and truly decentralized system, empowering users with faster claims, lower costs, and complete control over their protection.
            </p>
            <VideoDialog />
          </div>
        </div>

        {/* Key Platform Roles Section */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center justify-center mb-8 lg:mb-12">
            <AnimatedGradientText>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold inline animate-gradient bg-gradient-to-r from-[#4facfe] via-[#1e3a8a] to-[#4facfe] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                Key Platform Roles
              </span>
            </AnimatedGradientText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
            {rolesData.map((role, index) => (
              <div
                key={role.id}
                className="relative bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                {index === 1 && (
                  <BorderBeam
                    size={150}
                    duration={8}
                    delay={index * 2}
                    colorFrom="#4A90E2"
                    colorTo="#13315C"
                  />
                )}
                <div className="flex flex-col items-center space-y-4">
                  <div className={`${role.iconBackground} p-2 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center`}>
                    <img
                      src={role.image}
                      alt={role.title}
                      className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center justify-center mb-8 lg:mb-12">
            <AnimatedGradientText>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold inline animate-gradient bg-gradient-to-r from-[#4facfe] via-[#1e3a8a] to-[#4facfe] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                How It Works
              </span>
            </AnimatedGradientText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Steps with consistent styling */}
            {[
              {
                icon: "/icon/financial.png",
                title: "Stake Assets",
                description: "Providers stake assets into insurance pools and set coverage terms."
              },
              {
                icon: "/icon/document.png",
                title: "Manage Pools",
                description: "Custodians manage pools and ensure secure fund management."
              },
              {
                icon: "/icon/validate.png",
                title: "Validate Claims",
                description: "Claim Assessors validate and process insurance claims."
              }
            ].map((step, index) => (
              <div key={index} className="relative bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                {index === 1 && (
                  <BorderBeam size={150} duration={8} delay={2} colorFrom="#4A90E2" colorTo="#13315C" />
                )}
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 dark:from-[#4393F5] dark:via-[#0B2545] dark:to-[#13315C] p-3 sm:p-4 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ClientWrapper>
    </main>
  );
};

export default Home;

const LeftSection = () => {
  return (
    <div className="w-full lg:w-3/5 text-center lg:text-left">
      <div className="z-10 flex min-h-20 items-center justify-start">
        <AnimatedGradientText>
          <span
            className={cn(
              `h-28 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold inline animate-gradient bg-gradient-to-r from-[#4facfe] via-[#1e3a8a] to-[#4facfe] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            The future of decentralized insurance with blockchain technology
          </span>
        </AnimatedGradientText>
      </div>
      <p className=" text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
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
  const Icons = {
    eigenlayer: () => (
      <Image src="/img/eigenlayer.jpg" className="rounded-full" alt="Eigenlayer" width={100} height={100} />
    ),
    arbitrum: () => (
      <Image src="/img/arbitrum.png" className="rounded-full" alt="Arbitrum" width={100} height={100} />
    ),
    apifs: () => (
      <Image src="/img/apifs.jpg" className="rounded-full" alt="API FS" width={100} height={100} />
    ),
    reclaim: () => (
      <Image src="/img/reclaim.webp" className="rounded-full" alt="Reclaim" width={100} height={100} />
    ),
  };

  const reverseIcons = {
    ethereum: () => (
      <Image src="/img/eth.svg" className="rounded-full" alt="Ethereum" width={100} height={100} />
    ),
    ethena: () => (
      <Image src="/img/ethena.svg" className="rounded-full" alt="Ethena" width={100} height={100} />
    ),
    bitcoin: () => (
      <Image src="/img/btc.webp" className="rounded-full" alt="API FS" width={100} height={100} />
    ),
    theGraphQL: () => (
      <Image src="/img/theGraphQL.webp" className="rounded-full" alt="The Graph" width={100} height={100} />
    ),
  };

  const innerIcons = Object.values(Icons);
  const outerIcons = Object.values(reverseIcons);

  return (
    <div className="hidden lg:flex w-full lg:w-2/5 justify-center lg:justify-end items-center">
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 lg:w-[35rem] md:h-[30rem] relative flex justify-center items-center animate-float">
        {/* Logo for light and dark modes */}
        <Image
          src="/insure-b.webp"
          alt="Protect.Fi Logo"
          width={60}
          height={60}
          className="object-contain block dark:hidden"
        />
        <Image
          src="/insure-w.webp"
          alt="Protect.Fi Logo"
          width={60}
          height={60}
          className="object-contain hidden dark:block"
        />

        {/* Inner Circles (All Icons) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {innerIcons.map((Icon, index) => (
            <OrbitingCircles
              key={`inner-${index}`}
              className="size-[50px] border-none bg-transparent"
              duration={20}
              delay={index * 5}
              radius={120}
            >
              <Icon />
            </OrbitingCircles>
          ))}
        </div>

        {/* Outer Circles (All Icons, Reverse) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {outerIcons.map((Icon, index) => (
            <OrbitingCircles
              key={`outer-${index}`}
              className="size-[50px] border-none bg-transparent"
              radius={220}
              duration={20}
              delay={index * 5}
              reverse
            >
              <Icon />
            </OrbitingCircles>
          ))}
        </div>
      </div>
    </div>
  );
};


const VideoDialog = () => {
  return (
    <div className="relative">
      <HeroVideoDialog
        className="dark:hidden block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}