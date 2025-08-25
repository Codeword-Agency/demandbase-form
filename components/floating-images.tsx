"use client"

import {useState} from "react"

interface FloatingImagesProps {
    imageUrls?: string[]
}

const FloatingImages = ({imageUrls = ['https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzk0bnJ6YzdjZ2phMjNmMzBmdnV0Zm5hN2ZvbTVrdnFqMmE4azY4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QuxqWk7m9ffxyfoa0a/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjdhaWJkd2x2dmNwdjlycDRqZjZxMWhmeWJiemtjZWF1anpneHR6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BvC7TmEd7odbi/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnV6NmVscHNuOHhrMHBzN3p0azlmcml1d3htMmEwNmNhNmY0dG16aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TFUYv2jzl9L9Kv2x4N/giphy.gif',
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm15cDV1MTh5MGZ1Y2NwcG4xajJ4eGU0ejVpb2c4cm1hdG05cDBiOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XUHaEglC894hq/giphy.gif'
    ] }: FloatingImagesProps) => {

    const [images, setImages] = useState([
        {id: 1, src: imageUrls[0], animationKey: 0},
        {id: 2, src: imageUrls[1], animationKey: 0},
    ])

    const getRandomImage = () => {
        return imageUrls[Math.floor(Math.random() * imageUrls.length)]
    }

    const randomIntFromInterval = (min: number, max: number) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

    const resetAnimation = (imageId: number) => {
        console.log("trigger");
        setImages((prev) => 
        prev.map((img) => 
            img.id === imageId ? { ...img, src: getRandomImage(), animationKey: img.animationKey + 1} : img,
    ),
    )
    }

    const animationDuration = 15
    const noOverlapDelay = animationDuration

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {images.map((image) => (
                <div
                    key = {`${image.id}-${image.animationKey}`}
                    className="absolute w-20 h-20 opacity-[0]"
                    style={{
                        left: image.id % 2 ? `${randomIntFromInterval(80, 90)}%` : `${randomIntFromInterval(0, 10)}%`,
                        animation: `floatUp ${animationDuration}s linear infinite`,
                        animationDelay: image.id === 1 ? `${randomIntFromInterval(0, 10)}s` : `${randomIntFromInterval(25, 35)}s`,
                    }}
                    onAnimationIteration={() => resetAnimation(image.id)}
                >
                <img 
                    src={image.src || 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzk0bnJ6YzdjZ2phMjNmMzBmdnV0Zm5hN2ZvbTVrdnFqMmE4azY4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QuxqWk7m9ffxyfoa0a/giphy.gif'}
                    alt=""
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                </div>
            ))}

            <style jsx>{`
                @keyframes floatUp {
                    0% {
                        transform: translateY(100vh);
                        opacity:1;
                    }
                    100% {
                        transform: translateY(-100px);
                        opacity:1;
                    }
                }
            `}</style>
            </div>
    )
}

export default FloatingImages