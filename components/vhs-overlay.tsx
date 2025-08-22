"use client"

import { useEffect, useState } from "react"

export default function VHSOverlay() {
  const [showDisplacementDistortion, setShowDisplacementDistortion] = useState(false)

  useEffect(() => {
    const triggerDisplacementDistortion = () => {
      setShowDisplacementDistortion(true)
      // Duration of displacement distortion (500ms to 1.5s)
      const duration = Math.random() * 1000 + 500
      setTimeout(() => {
        setShowDisplacementDistortion(false)
      }, duration)
    }

    const scheduleNext = () => {
      // Random interval between 15-30 seconds
      const interval = Math.random() * 15000 + 15000
      setTimeout(() => {
        triggerDisplacementDistortion()
        scheduleNext()
      }, interval)
    }

    scheduleNext()
  }, [])

  return (
    <>
      {/* SVG Filter Definitions */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="vhs-base" x="-10%" y="-10%" width="120%" height="120%">
            {/* Light continuous tracking */}
            <feTurbulence baseFrequency="0.001 0.4" numOctaves="1" result="baseNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="baseNoise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
              result="baseTracked"
            />

            {/* Subtle RGB separation */}
            <feOffset in="baseTracked" dx="1" dy="0" result="r" />
            <feOffset in="baseTracked" dx="-0.5" dy="0" result="b" />
            <feComponentTransfer in="r" result="r2">
              <feFuncR type="discrete" tableValues="1 0 0" />
              <feFuncG type="discrete" tableValues="0 0 0" />
              <feFuncB type="discrete" tableValues="0 0 0" />
            </feComponentTransfer>
            <feComponentTransfer in="b" result="b2">
              <feFuncR type="discrete" tableValues="0 0 0" />
              <feFuncG type="discrete" tableValues="0 0 0" />
              <feFuncB type="discrete" tableValues="0 0 1" />
            </feComponentTransfer>
            <feBlend in="r2" in2="baseTracked" mode="screen" result="rb" />
            <feBlend in="b2" in2="rb" mode="screen" />
          </filter>

          <filter id="displacement-distortion" x="-30%" y="-30%" width="160%" height="160%">
            {/* Primary displacement for major tracking errors */}
            <feTurbulence baseFrequency="0.8 0.05" numOctaves="2" result="majorNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="majorNoise"
              scale="35"
              xChannelSelector="R"
              yChannelSelector="G"
              result="majorDisplaced"
            />

            {/* Secondary displacement for fine detail corruption */}
            <feTurbulence baseFrequency="2.5 0.1" numOctaves="3" result="detailNoise" />
            <feDisplacementMap
              in="majorDisplaced"
              in2="detailNoise"
              scale="18"
              xChannelSelector="B"
              yChannelSelector="R"
              result="detailDisplaced"
            />

            {/* Tertiary displacement for micro-jitter */}
            <feTurbulence baseFrequency="5.0 1.0" numOctaves="1" result="jitterNoise" />
            <feDisplacementMap
              in="detailDisplaced"
              in2="jitterNoise"
              scale="8"
              xChannelSelector="G"
              yChannelSelector="B"
              result="jittered"
            />

            {/* Horizontal sync displacement */}
            <feTurbulence baseFrequency="0.02 0.8" numOctaves="1" result="syncNoise" />
            <feDisplacementMap
              in="jittered"
              in2="syncNoise"
              scale="25"
              xChannelSelector="B"
              yChannelSelector="R"
              result="syncDisplaced"
            />

            {/* Extreme RGB separation with individual displacement */}
            <feOffset in="syncDisplaced" dx="12" dy="0" result="rShift" />
            <feOffset in="syncDisplaced" dx="-8" dy="1" result="bShift" />
            <feOffset in="syncDisplaced" dx="0" dy="-2" result="gShift" />

            <feDisplacementMap in="rShift" in2="majorNoise" scale="10" result="rDisplaced" />
            <feDisplacementMap in="bShift" in2="detailNoise" scale="8" result="bDisplaced" />
            <feDisplacementMap in="gShift" in2="jitterNoise" scale="6" result="gDisplaced" />

            <feComponentTransfer in="rDisplaced" result="redChannel">
              <feFuncR type="discrete" tableValues="1 0.8 1 0.6 1 0.9" />
              <feFuncG type="discrete" tableValues="0 0.2 0 0.1 0 0.15" />
              <feFuncB type="discrete" tableValues="0.8 0 0.9 0 0.7 0" />
            </feComponentTransfer>
            <feComponentTransfer in="bDisplaced" result="blueChannel">
              <feFuncR type="discrete" tableValues="0 0.1 0.2 0 0.15 0" />
              <feFuncG type="discrete" tableValues="0.9 0 0.8 0.2 0.85 0" />
              <feFuncB type="discrete" tableValues="1 0.7 1 0.5 1 0.8" />
            </feComponentTransfer>
            <feComponentTransfer in="gDisplaced" result="greenChannel">
              <feFuncR type="discrete" tableValues="0.1 0 0.2 0 0.05 0" />
              <feFuncG type="discrete" tableValues="1 0.9 1 0.8 1 0.95" />
              <feFuncB type="discrete" tableValues="0.1 0 0.2 0 0.05 0" />
            </feComponentTransfer>

            <feBlend in="redChannel" in2="syncDisplaced" mode="screen" result="rg" />
            <feBlend in="blueChannel" in2="rg" mode="screen" result="rgb" />
            <feBlend in="greenChannel" in2="rgb" mode="screen" />
          </filter>
        </defs>
      </svg>

      <style jsx global>{`
        body {
          filter: url(#vhs-base);
          transition: filter 0.1s ease-out;
        }
        
        body.displacement-active {
          filter: url(#vhs-base) url(#displacement-distortion);
        }
        
        @keyframes vhs-scroll {
          0% { transform: translateY(0px); }
          100% { transform: translateY(4px); }
        }
      `}</style>

      {typeof window !== "undefined" && (
        <>
          {showDisplacementDistortion &&
            (() => {
              document.body.classList.add("displacement-active")
              setTimeout(() => {
                document.body.classList.remove("displacement-active")
              }, 100)
              return null
            })()}
        </>
      )}

      {/* VHS Overlay - Always visible with continuous effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-100"
        style={{
          mixBlendMode: "multiply",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
            animation: "vhs-scroll 0.1s linear infinite",
          }}
        />
      </div>
    </>
  )
}
