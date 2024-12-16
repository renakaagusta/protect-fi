import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { wagmiConfig } from "@/configs/wagmi";
import {
  Chain,
  darkTheme,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import "../styles/globals.css";
import Head from "next/head";
import { AspectRatio } from "@radix-ui/themes";
import ElegantGradientBackground from "@/components/home/background";
import { Toaster } from "sonner";

const localChain: Chain = {
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://ganache.renakaagusta.dev"],
    },
    public: {
      http: ["https://ganache.renakaagusta.dev"],
    },
  },
  blockExplorers: {
    default: {
      name: "Ganache Explorer",
      url: "https://ganache.renakaagusta.dev",
    },
  },
  testnet: true,
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={arbitrumSepolia}
          theme={darkTheme({
            accentColor: 'white',
            accentColorForeground: 'black',
          })}
        >
          <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            value={{ light: "light", dark: "dark" }}
            defaultTheme="system"
          >
            <Head>
              <link rel="icon" type="image/webp" href="/insure-b.webp" />
            </Head>
            <AspectRatio ratio={16 / 9} className="">
              <ElegantGradientBackground>
                <Header />
                <Component {...pageProps} />
                <Footer/>
                <Toaster />
              </ElegantGradientBackground>
            </AspectRatio>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
