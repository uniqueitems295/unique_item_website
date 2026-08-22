"use client"
import React, { useEffect, useRef } from "react"

export default function AutoPlayVideo({ src, className }: { src: string; className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        
        video.muted = true
        video.play().catch(() => {})
    }, [src])

    return (
        <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className={className}
        />
    )
}
