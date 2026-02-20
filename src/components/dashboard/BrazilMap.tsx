"use client"

import React, { useMemo } from "react"
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps"
import { scaleSequential } from "d3-scale"
import { interpolateRdYlGn } from "d3-scale-chromatic"

// URL for Brazil States TopoJSON/GeoJSON
const BORDER_COLOR = "#334155"
const BRAZIL_JSON = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.json"

interface MapData {
    uf: string
    sla: number
    link_outages: number
    energia_outages: number
}

interface BrazilMapProps {
    data: MapData[]
    onStateClick?: (uf: string) => void
}

const BrazilMap: React.FC<BrazilMapProps> = ({ data, onStateClick }) => {
    const colorScale = useMemo(() => {
        return scaleSequential(interpolateRdYlGn).domain([90, 100])
    }, [])

    const getSlaByUf = (uf: string) => {
        const item = data.find((d) => d.uf === uf)
        return item ? item.sla : null
    }

    return (
        <div className="relative w-full h-[600px] rounded-xl border bg-card text-card-foreground shadow">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-lg font-semibold">Status Nacional por Estado</h3>
                <p className="text-sm text-muted-foreground">SLA Diário (D-1)</p>
            </div>
            <ComposableMap
                projectionConfig={{ scale: 800, center: [-55, -15] }}
                className="w-full h-full"
            >
                <ZoomableGroup zoom={1} maxZoom={3}>
                    <Geographies geography={BRAZIL_JSON}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const uf = geo.properties.sigla
                                const sla = getSlaByUf(uf)
                                const fillColor = sla !== null ? (colorScale(sla) as unknown as string) : "#1e293b"

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        stroke={BORDER_COLOR}
                                        strokeWidth={0.5}
                                        fill={fillColor}
                                        className="transition-colors duration-200 outline-none hover:fill-primary/60 cursor-pointer"
                                        onClick={() => onStateClick?.(uf)}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { outline: "none" },
                                            pressed: { outline: "none" }
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScale(100) as unknown as string }} />
                    <span>99.9% - 100%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScale(95) as unknown as string }} />
                    <span>95% - 98%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorScale(90) as unknown as string }} />
                    <span>&lt; 95%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <span>Sem Dados</span>
                </div>
            </div>
        </div>
    )
}

export default BrazilMap
