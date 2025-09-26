const BlueBlobBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
            {/* Animated organic blob shapes - optimized for desktop landscape */}
            <div className="absolute inset-0">
                {/* Large blob - top left */}
                <svg
                    className="absolute -top-32 -left-32 w-[600px] h-[600px] animate-pulse"
                    style={{ filter: "blur(60px)" }}
                >
                    <path
                        d="M200,50 C350,20 450,80 500,200 C480,350 420,450 300,480 C150,460 50,380 20,250 C40,120 120,70 200,50 Z"
                        fill="#60a5fa"
                    />
                </svg>

                {/* Large blob - top right */}
                <svg
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] animate-bounce"
                    style={{ animationDuration: "8s", filter: "blur(70px)" }}
                >
                    <path
                        d="M180,80 C320,30 480,100 550,240 C580,380 500,520 350,560 C200,540 80,460 40,320 C20,180 100,100 180,80 Z"
                        fill="#93c5fd"
                    />
                </svg>

                {/* Massive blob - bottom center */}
                <svg
                    className="absolute -bottom-48 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] animate-pulse"
                    style={{ animationDelay: "2s", filter: "blur(80px)" }}
                >
                    <path
                        d="M150,100 C300,40 500,80 650,220 C700,360 620,540 480,650 C340,680 160,620 80,480 C40,340 80,180 150,100 Z"
                        fill="#60a5fa"
                    />
                </svg>

                {/* Medium blob - center right */}
                <svg
                    className="absolute top-1/4 -right-20 w-96 h-96 animate-bounce"
                    style={{
                        animationDuration: "10s",
                        animationDelay: "1s",
                        filter: "blur(50px)",
                    }}
                >
                    <path
                        d="M120,60 C220,30 280,90 300,180 C290,270 240,320 160,340 C80,320 30,260 20,180 C30,100 80,70 120,60 Z"
                        fill="#dbeafe"
                    />
                </svg>

                {/* Large blob - center left */}
                <svg
                    className="absolute top-1/2 -left-40 w-[500px] h-[500px] animate-pulse"
                    style={{
                        animationDuration: "6s",
                        animationDelay: "3s",
                        filter: "blur(65px)",
                    }}
                >
                    <path
                        d="M160,70 C280,20 400,60 450,180 C470,300 410,400 290,430 C170,440 70,380 40,260 C30,140 90,90 160,70 Z"
                        fill="#93c5fd"
                    />
                </svg>

                {/* Medium floating blobs for desktop spacing */}
                <svg
                    className="absolute top-1/6 left-1/3 w-64 h-64 animate-bounce"
                    style={{ animationDuration: "12s", filter: "blur(45px)" }}
                >
                    <path
                        d="M100,40 C160,20 200,60 220,120 C210,180 170,210 120,220 C70,210 30,170 20,120 C25,70 65,45 100,40 Z"
                        fill="#dbeafe"
                    />
                </svg>
                <svg
                    className="absolute top-2/3 right-1/3 w-80 h-80 animate-pulse"
                    style={{
                        animationDuration: "9s",
                        animationDelay: "5s",
                        filter: "blur(55px)",
                    }}
                >
                    <path
                        d="M140,50 C240,25 320,70 350,170 C360,270 310,340 220,360 C130,350 60,290 40,200 C35,110 85,65 140,50 Z"
                        fill="#93c5fd"
                    />
                </svg>

                {/* Additional desktop blobs for wider screens */}
                <svg
                    className="absolute top-1/2 left-1/6 w-48 h-48 animate-bounce"
                    style={{
                        animationDuration: "14s",
                        animationDelay: "2s",
                        filter: "blur(40px)",
                    }}
                >
                    <path
                        d="M80,35 C130,15 170,45 185,95 C180,145 150,175 105,185 C60,175 25,145 15,95 C20,55 50,40 80,35 Z"
                        fill="#f1f5f9"
                    />
                </svg>
                <svg
                    className="absolute top-1/3 right-1/6 w-56 h-56 animate-pulse"
                    style={{
                        animationDuration: "11s",
                        animationDelay: "6s",
                        filter: "blur(45px)",
                    }}
                >
                    <path
                        d="M90,45 C150,25 190,65 210,115 C200,165 160,195 110,205 C60,195 20,155 10,105 C15,65 55,50 90,45 Z"
                        fill="#dbeafe"
                    />
                </svg>
            </div>

            {/* Subtle overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800/10 via-transparent to-blue-400/5"></div>

            {/* Content wrapper */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BlueBlobBackground;
