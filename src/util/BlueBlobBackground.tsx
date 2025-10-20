const BlueBlobBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Animated organic blob shapes - SPECTACULAR VERSION */}
            <div className="absolute inset-0">
                {/* Massive gradient blob - top left */}
                <div 
                    className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)",
                        filter: "blur(60px)",
                        animationDuration: "20s"
                    }}
                />

                {/* Huge gradient blob - top right */}
                <div 
                    className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)",
                        filter: "blur(70px)",
                        animationDuration: "25s",
                        animationDelay: "2s"
                    }}
                />

                {/* Giant gradient blob - bottom */}
                <div 
                    className="absolute -bottom-1/3 left-1/4 w-[1000px] h-[1000px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 197, 253, 0.2) 50%, transparent 70%)",
                        filter: "blur(80px)",
                        animationDuration: "30s",
                        animationDelay: "5s"
                    }}
                />

                {/* Medium gradient blob - center right */}
                <div 
                    className="absolute top-1/3 -right-20 w-[600px] h-[600px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(219, 39, 119, 0.15) 50%, transparent 70%)",
                        filter: "blur(50px)",
                        animationDuration: "22s",
                        animationDelay: "3s"
                    }}
                />

                {/* Large gradient blob - center left */}
                <div 
                    className="absolute top-1/2 -left-32 w-[700px] h-[700px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)",
                        filter: "blur(65px)",
                        animationDuration: "28s",
                        animationDelay: "7s"
                    }}
                />

                {/* Floating accent blobs */}
                <div 
                    className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(244, 114, 182, 0.2) 50%, transparent 70%)",
                        filter: "blur(45px)",
                        animationDuration: "18s",
                        animationDelay: "4s"
                    }}
                />
                
                <div 
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(196, 181, 253, 0.35) 0%, rgba(167, 139, 250, 0.25) 50%, transparent 70%)",
                        filter: "blur(55px)",
                        animationDuration: "24s",
                        animationDelay: "6s"
                    }}
                />

                {/* Small accent blobs for extra sparkle */}
                <div 
                    className="absolute top-1/6 right-1/3 w-[300px] h-[300px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(253, 186, 116, 0.3) 0%, rgba(251, 146, 60, 0.2) 50%, transparent 70%)",
                        filter: "blur(40px)",
                        animationDuration: "16s",
                        animationDelay: "8s"
                    }}
                />

                <div 
                    className="absolute bottom-1/3 left-1/6 w-[350px] h-[350px] rounded-full animate-float"
                    style={{ 
                        background: "radial-gradient(circle, rgba(134, 239, 172, 0.3) 0%, rgba(74, 222, 128, 0.2) 50%, transparent 70%)",
                        filter: "blur(42px)",
                        animationDuration: "19s",
                        animationDelay: "1s"
                    }}
                />
            </div>

            {/* Mesh gradient overlay for extra depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
            
            {/* Subtle noise texture for premium feel */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            }}></div>

            {/* Content wrapper */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BlueBlobBackground;
