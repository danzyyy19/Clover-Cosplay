"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const validImages = images && images.length > 0 ? images : ["/images/placeholder.png"];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Minimum swipe distance (in px) 
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    // Mouse drag support for desktop
    const onMouseDown = (e: React.MouseEvent) => {
        setTouchEnd(null);
        setTouchStart(e.clientX);
        setIsDragging(true);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging) setTouchEnd(e.clientX);
    };

    const onMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            if (touchStart && touchEnd) {
                const distance = touchStart - touchEnd;
                if (distance > minSwipeDistance) handleNext();
                if (distance < -minSwipeDistance) handlePrev();
            }
        }
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", userSelect: "none" }}>
            {/* Main Image Stage */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3/4",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    cursor: isDragging ? "grabbing" : "grab"
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => setIsDragging(false)}
            >
                <img
                    src={validImages[selectedIndex]}
                    alt={`${title} - View ${selectedIndex + 1}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: isDragging ? "none" : "transform 0.3s ease",
                        pointerEvents: "none" // Prevent default drag behavior
                    }}
                />

                {/* Navigation Arrows (Only if multiple images) */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10
                            }}
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Dots Indicator */}
                        <div style={{
                            position: "absolute",
                            bottom: "16px",
                            left: "0",
                            right: "0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "6px",
                            zIndex: 10
                        }}>
                            {validImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: idx === selectedIndex ? "8px" : "6px",
                                        height: idx === selectedIndex ? "8px" : "6px",
                                        borderRadius: "50%",
                                        backgroundColor: idx === selectedIndex ? "white" : "rgba(255,255,255,0.5)",
                                        transition: "all 0.3s"
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    scrollbarWidth: "none"
                }}>
                    {validImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            style={{
                                width: "80px",
                                height: "80px",
                                flexShrink: 0,
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: selectedIndex === index
                                    ? "2px solid var(--color-clover-purple)"
                                    : "2px solid transparent",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.2s",
                                opacity: selectedIndex === index ? 1 : 0.7
                            }}
                        >
                            <img
                                src={img}
                                alt={`${title} Thumbnail ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
