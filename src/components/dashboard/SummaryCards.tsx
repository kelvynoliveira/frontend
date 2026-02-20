"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Globe, ShieldAlert, Zap } from "lucide-react"

interface SummaryProps {
    title: string
    value: string | number
    unit?: string
    delta: number
    icon: React.ElementType
    colorClass: string
}

const SummaryCard: React.FC<SummaryProps> = ({ title, value, unit, delta, icon: Icon, colorClass }) => {
    const isPositive = delta >= 0

    return (
        <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${colorClass})` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}{unit}
                </div>
                <div className="flex items-center gap-1 mt-1">
                    {isPositive ? (
                        <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
                    ) : (
                        <ArrowDownIcon className="h-3 w-3 text-rose-500" />
                    )}
                    <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {Math.abs(delta)}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs. período anterior</span>
                </div>
            </CardContent>
        </Card>
    )
}

interface SummaryData {
    globalSla: number
    globalSlaDelta: number
    totalOutages: number
    outagesDelta: number
    energyOutages: number
    energyDelta: number
    totalLinks: number
}

const SummaryDashboard: React.FC<{ data: SummaryData }> = ({ data }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
                title="SLA Consolidado"
                value={data.globalSla.toFixed(2)}
                unit="%"
                delta={data.globalSlaDelta}
                icon={Globe}
                colorClass="primary"
            />
            <SummaryCard
                title="Total de Quedas"
                value={data.totalOutages}
                delta={data.outagesDelta}
                icon={ShieldAlert}
                colorClass="rose-500"
            />
            <SummaryCard
                title="Incidentes Energia"
                value={data.energyOutages}
                delta={data.energyDelta}
                icon={Zap}
                colorClass="amber-500"
            />
            <SummaryCard
                title="Links Ativos"
                value={data.totalLinks}
                delta={0.2}
                icon={Globe}
                colorClass="emerald-500"
            />
        </div>
    )
}

export default SummaryDashboard
