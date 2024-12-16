import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import Particles from '../ui/particles';

export default function ElegantGradientBackground({ children }: { children: React.ReactNode }) {

    const { resolvedTheme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
    }, [resolvedTheme]);
    return (
        <div 
        className="min-h-screen w-full bg-gradient-to-b dark:from-neutral-950 dark:to-neutral-800 from-neutral-100 to-neutral-300"
        >

            {children}
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color={color}
                refresh
            />
        </div>
    )
}