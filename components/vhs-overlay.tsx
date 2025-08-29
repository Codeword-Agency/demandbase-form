"use client"

import { useEffect, useState } from "react"

export default function VHSOverlay() {
  const [showDisplacementDistortion, setShowDisplacementDistortion] = useState(false)
  const [turbulenceScale, setTurbulenceScale] = useState(2);
  const [baseFreq, setBaseFreq] = useState("0.004 0.2") ;

  useEffect(() => {
    const triggerDisplacementDistortion = () => {
      // Duration of displacement distortion (500ms to 1.5s)
      const duration = Math.random() * 1000 + 500
      setTimeout(() => {
        setShowDisplacementDistortion(false)
      }, duration) 
    }

    const scheduleNext = () => {
      // Random interval between 60-120 seconds
      const interval = Math.random() * 60000 + 120000
      setTimeout(() => {
        triggerDisplacementDistortion()
        scheduleNext()
      }, interval)
    }

    const randomizeTurbulence = () => {
      // Randomly spike the scale from 20 to 200 for brief moments
      const spikeScale = Math.random() * 180 + 20 // 20-200 range
      setTurbulenceScale(spikeScale)
      document.querySelector('.site-bg').classList.toggle('spooky')
      // Return to normal after 50-150ms
      const spikeDuration = Math.random() * 100 + 50
      setTimeout(() => {
        setTurbulenceScale(2) // Back to normal
      }, spikeDuration)
    }

    const scheduleRandomTurbulence = () => {
      // Random interval between 3-8 seconds for turbulence spikes
      const interval = Math.random() * 10000 + 3000
      setTimeout(() => {
        randomizeTurbulence()
        scheduleRandomTurbulence()
      }, interval)
    }

    if(window.innerWidth < 600){
    setInterval(() => {
      var starting = Math.random() * 200;
      var otherStart = Math.random() * 200;
      setBaseFreq(otherStart+" "+starting);
      }, 100);
    }


      

    scheduleNext()
    scheduleRandomTurbulence()
  }, [])

  return (
    <>
      {/* SVG Filter Definitions */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="vhs-base" x="-10%" y="-10%" width="120%" height="120%">
            {/* Light continuous tracking */}
            <feTurbulence baseFrequency={baseFreq} numOctaves="1" result="baseNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="baseNoise"
              scale={turbulenceScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="baseTracked"
            />

            {/* Subtle RGB separation 
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
            <feBlend in="b2" in2="rb" mode="screen" />*/}
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

            <feOffset in="syncDisplaced" dx="8" dy="0" result="rShift" />
            <feOffset in="syncDisplaced" dx="-4" dy="0" result="bShift" />
            <feOffset in="syncDisplaced" dx="0" dy="0" result="gShift" />

            <feComponentTransfer in="rShift" result="redChannel">
              <feFuncR type="identity" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>
            <feComponentTransfer in="bShift" result="blueChannel">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="identity" />
            </feComponentTransfer>
            <feComponentTransfer in="gShift" result="greenChannel">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="identity" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>

            <feBlend in="redChannel" in2="syncDisplaced" mode="normal" result="rg" />
            <feBlend in="blueChannel" in2="rg" mode="normal" result="rgb" />
            <feBlend in="greenChannel" in2="rgb" mode="normal" />
          </filter>
        </defs>
      </svg>

      <style jsx global>{`
        .site-bg {
          filter: url(#vhs-base);
          transition: filter 0.1s ease-out;
        }
        
        .site-bg.displacement-active {
          filter: url(#vhs-base) url(#displacement-distortion);
        }
        
        @keyframes vhs-scroll {
          0% { transform: translateY(0px); }
          100% { transform: translateY(6px); }
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
        className="the-filter fixed inset-0 pointer-events-none z-50 opacity-100"
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
