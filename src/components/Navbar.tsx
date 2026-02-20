"use client"

import React from "react"
import { Moon, Sun, Activity } from "lucide-react"
import { useTheme } from "next-themes"

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch by only rendering theme-dependent UI after mount
    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">Monitoring<span className="text-primary">Platform</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                        {!mounted ? (
                            <div className="h-4 w-4" /> // Placeholder while mounting
                        ) : theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            AD
                        </div>
                        <span className="text-sm font-medium hidden md:block">Admin Dashboard</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
