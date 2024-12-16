"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const chartData = [
    { date: "2024-04-01", insurer: 222, insured: 150 },
    { date: "2024-04-02", insurer: 97, insured: 180 },
    { date: "2024-04-03", insurer: 167, insured: 120 },
    { date: "2024-04-04", insurer: 242, insured: 260 },
    { date: "2024-04-05", insurer: 373, insured: 290 },
    { date: "2024-04-06", insurer: 301, insured: 340 },
    { date: "2024-04-07", insurer: 245, insured: 180 },
    { date: "2024-04-08", insurer: 409, insured: 320 },
    { date: "2024-04-09", insurer: 59, insured: 110 },
    { date: "2024-04-10", insurer: 261, insured: 190 },
    { date: "2024-04-11", insurer: 327, insured: 350 },
    { date: "2024-04-12", insurer: 292, insured: 210 },
    { date: "2024-04-13", insurer: 342, insured: 380 },
    { date: "2024-04-14", insurer: 137, insured: 220 },
    { date: "2024-04-15", insurer: 120, insured: 170 },
    { date: "2024-04-16", insurer: 138, insured: 190 },
    { date: "2024-04-17", insurer: 446, insured: 360 },
    { date: "2024-04-18", insurer: 364, insured: 410 },
    { date: "2024-04-19", insurer: 243, insured: 180 },
    { date: "2024-04-20", insurer: 89, insured: 150 },
    { date: "2024-04-21", insurer: 137, insured: 200 },
    { date: "2024-04-22", insurer: 224, insured: 170 },
    { date: "2024-04-23", insurer: 138, insured: 230 },
    { date: "2024-04-24", insurer: 387, insured: 290 },
    { date: "2024-04-25", insurer: 215, insured: 250 },
    { date: "2024-04-26", insurer: 75, insured: 130 },
    { date: "2024-04-27", insurer: 383, insured: 420 },
    { date: "2024-04-28", insurer: 122, insured: 180 },
    { date: "2024-04-29", insurer: 315, insured: 240 },
    { date: "2024-04-30", insurer: 454, insured: 380 },
    { date: "2024-05-01", insurer: 165, insured: 220 },
    { date: "2024-05-02", insurer: 293, insured: 310 },
    { date: "2024-05-03", insurer: 247, insured: 190 },
    { date: "2024-05-04", insurer: 385, insured: 420 },
    { date: "2024-05-05", insurer: 481, insured: 390 },
    { date: "2024-05-06", insurer: 498, insured: 520 },
    { date: "2024-05-07", insurer: 388, insured: 300 },
    { date: "2024-05-08", insurer: 149, insured: 210 },
    { date: "2024-05-09", insurer: 227, insured: 180 },
    { date: "2024-05-10", insurer: 293, insured: 330 },
    { date: "2024-05-11", insurer: 335, insured: 270 },
    { date: "2024-05-12", insurer: 197, insured: 240 },
    { date: "2024-05-13", insurer: 197, insured: 160 },
    { date: "2024-05-14", insurer: 448, insured: 490 },
    { date: "2024-05-15", insurer: 473, insured: 380 },
    { date: "2024-05-16", insurer: 338, insured: 400 },
    { date: "2024-05-17", insurer: 499, insured: 420 },
    { date: "2024-05-18", insurer: 315, insured: 350 },
    { date: "2024-05-19", insurer: 235, insured: 180 },
    { date: "2024-05-20", insurer: 177, insured: 230 },
    { date: "2024-05-21", insurer: 82, insured: 140 },
    { date: "2024-05-22", insurer: 81, insured: 120 },
    { date: "2024-05-23", insurer: 252, insured: 290 },
    { date: "2024-05-24", insurer: 294, insured: 220 },
    { date: "2024-05-25", insurer: 201, insured: 250 },
    { date: "2024-05-26", insurer: 213, insured: 170 },
    { date: "2024-05-27", insurer: 420, insured: 460 },
    { date: "2024-05-28", insurer: 233, insured: 190 },
    { date: "2024-05-29", insurer: 78, insured: 130 },
    { date: "2024-05-30", insurer: 340, insured: 280 },
    { date: "2024-05-31", insurer: 178, insured: 230 },
    { date: "2024-06-01", insurer: 178, insured: 200 },
    { date: "2024-06-02", insurer: 470, insured: 410 },
    { date: "2024-06-03", insurer: 103, insured: 160 },
    { date: "2024-06-04", insurer: 439, insured: 380 },
    { date: "2024-06-05", insurer: 88, insured: 140 },
    { date: "2024-06-06", insurer: 294, insured: 250 },
    { date: "2024-06-07", insurer: 323, insured: 370 },
    { date: "2024-06-08", insurer: 385, insured: 320 },
    { date: "2024-06-09", insurer: 438, insured: 480 },
    { date: "2024-06-10", insurer: 155, insured: 200 },
    { date: "2024-06-11", insurer: 92, insured: 150 },
    { date: "2024-06-12", insurer: 492, insured: 420 },
    { date: "2024-06-13", insurer: 81, insured: 130 },
    { date: "2024-06-14", insurer: 426, insured: 380 },
    { date: "2024-06-15", insurer: 307, insured: 350 },
    { date: "2024-06-16", insurer: 371, insured: 310 },
    { date: "2024-06-17", insurer: 475, insured: 520 },
    { date: "2024-06-18", insurer: 107, insured: 170 },
    { date: "2024-06-19", insurer: 341, insured: 290 },
    { date: "2024-06-20", insurer: 408, insured: 450 },
    { date: "2024-06-21", insurer: 169, insured: 210 },
    { date: "2024-06-22", insurer: 317, insured: 270 },
    { date: "2024-06-23", insurer: 480, insured: 530 },
    { date: "2024-06-24", insurer: 132, insured: 180 },
    { date: "2024-06-25", insurer: 141, insured: 190 },
    { date: "2024-06-26", insurer: 434, insured: 380 },
    { date: "2024-06-27", insurer: 448, insured: 490 },
    { date: "2024-06-28", insurer: 149, insured: 200 },
    { date: "2024-06-29", insurer: 103, insured: 160 },
    { date: "2024-06-30", insurer: 446, insured: 400 },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    insurer: {
        label: "Insurer",
        color: "#2761D8",
    },
    insured: {
        label: "Insured",
        color: "#4facfe",
    },
} satisfies ChartConfig

export function InsureTVL() {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Protect.fi TVL</CardTitle>
                    <CardDescription>
                        Showing total TVL for the last 3 months
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[400px] w-full"
                >
                    <AreaChart data={filteredData} >
                        <defs>
                            <linearGradient id="fillInsurer" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-insurer)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-insurer)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillInsured" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-insured)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-insured)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="insured"
                            type="natural"
                            fill="url(#fillInsured)"
                            stroke="var(--color-insured)"
                            stackId="a"
                        />
                        <Area
                            dataKey="insurer"
                            type="natural"
                            fill="url(#fillInsurer)"
                            stroke="var(--color-insurer)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
