"use client"

import React, { useState, useEffect } from "react"
import SummaryDashboard from "@/components/dashboard/SummaryCards"
import BrazilMap from "@/components/dashboard/BrazilMap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts"
import { fetchSummary, fetchMapData } from "@/lib/api"

const SLA_HISTORY = [
    { date: "01/02", sla: 99.2 },
    { date: "05/02", sla: 99.5 },
    { date: "10/02", sla: 98.8 },
    { date: "15/02", sla: 99.1 },
    { date: "20/02", sla: 99.4 },
]

export default function DashboardPage() {
    const [selectedState, setSelectedState] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<any>(null)
    const [mapData, setMapData] = useState<any[]>([])

    // Ensure charts and maps only render on client to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)

        async function loadData() {
            try {
                const today = new Date().toISOString().split('T')[0]
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

                const [summaryRes, mapRes] = await Promise.all([
                    fetchSummary(yesterday, today),
                    fetchMapData(today)
                ])

                // Process summary to match component expectation
                if (summaryRes && summaryRes.length > 0) {
                    setSummary({
                        globalSla: summaryRes[0].sla,
                        globalSlaDelta: summaryRes[0].delta_previous_period,
                        totalOutages: 42,
                        outagesDelta: -5,
                        energyOutages: 12,
                        energyDelta: -15,
                        totalLinks: summaryRes[0].total_links
                    })
                }
                setMapData(mapRes || [])
            } catch (error) {
                console.error("Erro ao carregar dados:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Carregando governança de conectividade...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-8 min-h-screen bg-background text-foreground">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Executive <span className="text-primary italic">Summary</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Monitoramento corporativo de disponibilidade e SLA em tempo real.
                </p>
            </div>

            <SummaryDashboard data={summary || { globalSla: 0, totalLinks: 0 }} />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BrazilMap
                        data={mapData}
                        onStateClick={(uf: string) => setSelectedState(uf)}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <Card className="h-full bg-slate-900/40 backdrop-blur-md border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Performance Histórica (Total)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SLA_HISTORY}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                    <YAxis domain={[95, 100]} stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                        itemStyle={{ color: '#38bdf8' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sla"
                                        stroke="#38bdf8"
                                        strokeWidth={3}
                                        dot={{ fill: '#38bdf8', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="h-full bg-slate-900/40 backdrop-blur-md border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Top 5 Marcas por SLA</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={[
                                    { name: "UNINASSAU", sla: 99.8 },
                                    { name: "UNAMA", sla: 99.5 },
                                    { name: "UNG", sla: 99.2 },
                                    { name: "UNIVERITAS", sla: 98.9 },
                                    { name: "UNINORTE", sla: 98.4 },
                                ]}>
                                    <XAxis type="number" domain={[95, 100]} hide />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    />
                                    <Bar dataKey="sla" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {selectedState && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary/50 shadow-lg shadow-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Detalhes: {selectedState}</CardTitle>
                            <p className="text-sm text-muted-foreground">Snapshot detalhado da unidade federativa</p>
                        </div>
                        <button
                            onClick={() => setSelectedState(null)}
                            className="text-xs text-muted-foreground hover:text-foreground underline"
                        >
                            Fechar Detalhes
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                <span className="text-xs font-medium uppercase text-muted-foreground">SLA Atual</span>
                                <p className="text-2xl font-bold text-primary">99.12%</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                <span className="text-xs font-medium uppercase text-muted-foreground">Chamados Abertos</span>
                                <p className="text-2xl font-bold text-amber-500">4</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                <span className="text-xs font-medium uppercase text-muted-foreground">Tempo Médio Reparo (MTTR)</span>
                                <p className="text-2xl font-bold text-emerald-500">45 min</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
