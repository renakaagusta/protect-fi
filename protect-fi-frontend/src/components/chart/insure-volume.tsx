"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { date: "2024-07-15", insurer: 450, insured: 300 },
    { date: "2024-07-16", insurer: 380, insured: 420 },
    { date: "2024-07-17", insurer: 520, insured: 120 },
    { date: "2024-07-18", insurer: 140, insured: 550 },
    { date: "2024-07-19", insurer: 600, insured: 350 },
    { date: "2024-07-20", insurer: 480, insured: 400 },
    { date: "2024-07-21", insurer: 430, insured: 310 },
    { date: "2024-07-22", insurer: 500, insured: 450 },
    { date: "2024-07-23", insurer: 390, insured: 420 },
    { date: "2024-07-24", insurer: 610, insured: 380 },
    { date: "2024-07-25", insurer: 490, insured: 320 },
    { date: "2024-07-26", insurer: 350, insured: 500 },
    { date: "2024-07-27", insurer: 520, insured: 440 },
    { date: "2024-07-28", insurer: 450, insured: 300 },
    { date: "2024-07-29", insurer: 610, insured: 420 },
    { date: "2024-07-30", insurer: 380, insured: 480 },
    { date: "2024-07-31", insurer: 540, insured: 300 },
    { date: "2024-08-01", insurer: 470, insured: 400 },
    { date: "2024-08-02", insurer: 430, insured: 500 },
    { date: "2024-08-03", insurer: 600, insured: 350 },
];


const chartConfig = {
    insurer: {
        label: "Insurer",
        color: "#2761D8",
    },
    insured: {
        label: "Insured",
        color: "#4facfe",
    },
} satisfies ChartConfig

export function InsureVolume() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Protect.fi</CardTitle>
                <CardDescription>
                    Showing total volume
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    weekday: "short",
                                })
                            }}
                        />
                        <Bar
                            dataKey="insurer"
                            stackId="a"
                            fill="var(--color-insurer)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="insured"
                            stackId="a"
                            fill="var(--color-insured)"
                            radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={false}
                            defaultIndex={1}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
