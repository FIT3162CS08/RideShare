"use client";
import Loading from "@/component/Loading";
import AchievementCard from "@/component/profile/AchievementCard";
import { useFetch } from "@/useHook/useFetch";
import BlueBlobBackground from "@/util/BlueBlobBackground";
import { useParams } from "next/navigation";

export default function UserPage() {
    const params = useParams();

    const { data, loading, error } = useFetch("s");

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="px-16 py-14 pb-34 my-12 rounded-2xl flex flex-col items-center justify-start font-sans from-slate-950/10 from-40% to-slate-50/30 bg-radial ">
            <h1 className="mt-10 w-fit text-5xl font-light text-shadow-2xs text-shadow-slate-500">
                YOUR DRIVER
            </h1>
            <h1 className="mt-22 w-fit text-3xl font-thin text-shadow-2xs text-shadow-slate-500">
                Profile
            </h1>
            <div className="mt-10 flex gap-25 justify-center">
                <div className="w-1/3 h-fit rounded-4xl overflow-clip">
                    <img
                        className="bg-blue-400 w-full rounded-4xl aspect-1/1"
                        src={data.user_url}
                    />
                </div>
                <div className="w-5/12 flex flex-col  items-center">
                    <div className="flex items-center justify-center gap-4">
                        <h1 className="text-2xl font-thin">{data.name}</h1> |
                        <h1 className="text-md font-thin">
                            Verified Monash Student
                        </h1>
                    </div>
                    <div className="text-md font-thin my-4 flex gap-4 justify-center items-center">
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.carpools | 44} <br /> carpools
                        </h3>
                        <span className="ml-1">|</span>
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.carpools | 23} 👍 <br /> thumbs up
                        </h3>
                        <span className="ml-1">|</span>
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.years | 3} <br /> years
                        </h3>
                    </div>
                    <h1 className="text-left text-lg font-[300] w-full pl-5 mb-3">
                        <span className="font-bold">🌐 Languages spoken</span>{" "}
                        {["English", "Hindi"].map((lang, i) => (
                            <span className="font-medium">
                                {lang}
                                {i != 1 ? ", " : "."}
                            </span>
                        ))}
                    </h1>
                    <h1 className="text-left text-lg font-[300] w-full pl-6 mb-3">
                        <span className="font-bold">📍 Key location </span>
                        Epping, North Melbourne
                    </h1>
                    <h1 className="text-left text-lg font-[300] w-full pl-6">
                        <span className="font-bold">💡 Fun Fact:</span>{" "}
                        {data.fun_fact || "I have a blackbelt in Karate"}
                    </h1>
                    <hr className="border-t-1.5  border-slate-950 rounded-full w-full h-0 my-5" />
                    <div className="text-left text-lg font-[300] w-full pl-6">
                        <span className="font-bold">🥴 Most Weird Trip: </span>
                        <span className="">
                            {data.fun_fact ||
                                "3 people threw up in my car once. 3 people threw up in my car once. 3 people threw up in my car once. "}
                        </span>
                    </div>
                    <hr className="border-t-1.5  border-slate-950/70 rounded-full w-full h-0 my-5" />
                </div>
            </div>
            <p className="text-lg  font-thin px-40 my-10">{data.description}</p>
            <div className="px-16 ">
                <h2 className="mt-10 text-3xl text-shadow-2xs text-shadow-slate-500 ">
                    Achievements
                </h2>
                <div
                    className="flex gap-8 mt-6 w-full overflow-x-scroll pb-4 px-5
                      [&::-webkit-scrollbar]:h-2
                      [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100/60
                      [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300/60
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700/60
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500/60"
                >
                    <AchievementCard
                        title={"Trustworthy"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                    <AchievementCard
                        title={"Polite"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                    <AchievementCard
                        title={"Trustworthy"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                    <AchievementCard
                        title={"Trustworthy"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                    <AchievementCard
                        title={"Trustworthy"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                    <AchievementCard
                        title={"Trustworthy"}
                        description={"This user has a high rating"}
                        img_url={
                            "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"
                        }
                    />
                </div>
            </div>
        </main>
    );
}
