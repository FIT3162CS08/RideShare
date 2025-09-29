"use client";
import Loading from "@/component/Loading";
import AchievementCard from "@/component/profile/AchievementCard";
import { useFetch } from "@/useHook/useFetch";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UserPage() {
    const {id} = useParams();
    const is_me = true;
    const [editing, setEditing] = useState(false)
    const [backupData, setBackupData] = useState()


    const { data, setData, loading, error } = useFetch(`http://localhost:3000/user/${id}`);


    function startEdit() {
        setEditing(_ => true)
        setBackupData(_ => data)
    }

    async function saveEdit() {
        try {
            const response = await fetch(`http://localhost:3000/user/${id}`, {
                method: "POST", // or PATCH, depending on your route setup
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const ret = await response.json();
            console.log("Updated user:", ret);
        } catch (error) {
            console.error(error);
        }
        // Stop editing
        setEditing(false)
    }

    function discardEdit() {
        setEditing(_ => false)
        setData(_ => backupData)
    }

    function editLabel(e, label, second_label) {
        if (second_label) {
            setData(d => ({
                ...d,
                [second_label] : {
                    ...data[second_label],
                    [label]: e.target.value
                }
            }))
        }

        setData(d => ({
            ...d,
            [label]: e.target.value
        }))
    }


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <h1>{error}</h1>
    }

    return (
        <main className="px-16 py-14 pb-34 my-12 rounded-2xl flex flex-col items-center justify-start font-sans from-slate-950/10 from-40% to-slate-50/30 bg-radial ">
            <div className="mt-10 flex flex-col items-center justify-center gap-5">
                <h1 className="w-fit text-5xl font-light text-shadow-2xs text-shadow-slate-500">
                    {is_me ? "YOUR PROFILE" : "ABOUT"}
                </h1>
                {
                    !is_me ? <></> :
                        (!editing) ? (
                            <button onClick={startEdit} className="px-6 py-3 bg-blue-950/15 rounded-xl cursor-pointer">
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={saveEdit} className="px-6 py-3 bg-blue-950/15 rounded-xl cursor-pointer">
                                    Save Changes
                                </button>
                                <button onClick={discardEdit} className="px-6 py-3 bg-blue-950/15 rounded-xl cursor-pointer">
                                    Discard Changes
                                </button>
                            </div>
                        )
                }
            </div>
            <h1 className="mt-22 w-fit text-3xl font-thin text-shadow-2xs text-shadow-slate-500">
                Profile
            </h1>
            <div className="mt-10 flex gap-14 justify-center">
                <div className="w-1/3 h-fit rounded-4xl overflow-clip">
                    <img
                        className="bg-blue-400 w-full rounded-4xl aspect-1/1"
                        src={data.user_url}
                    />
                </div>
                <div className="w-5/12 flex flex-col  items-center">
                    <div className="flex items-center justify-center gap-4">
                        {
                          editing 
                            ? <input className="text-xl font-thin bg-slate-100/40 px-2 py-1 rounded-lg outline-1" value={data.username} onChange={(e) => editLabel(e, "username")} /> 
                            : <h1 className="text-2xl font-thin">{data.username}</h1>
                        }
                        |
                        <h1 className="text-md font-thin">
                            Verified Monash Student
                        </h1>
                    </div>
                    <div className="text-md font-thin my-4 flex gap-4 justify-center items-center">
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.trips_count | 0} <br /> trips taken
                        </h3>
                        <span className="ml-1">|</span>
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.thumbsup | 5} 👍 <br /> thumbs up
                        </h3>
                        <span className="ml-1">|</span>
                        <h3 className="text-shadow-2xs text-shadow-amber-50 text-center">
                            {data.year | 2025} <br /> start year
                        </h3>
                    </div>
                    <div className="text-left text-lg font-[300] w-full pl-6 mb-3">
                        <span className="font-bold">🌐 Languages spoken</span>{" "}
                        {(data.languages|| ["English", "Hindi"]).map((lang, i) => (
                            <span key={i} className="font-medium">
                                {lang}
                                {i != 1 ? ", " : "."}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 text-left text-lg font-[300] w-full pl-6 mb-3">
                        <span className="font-bold">📍 Key location: </span>
                        {
                          editing 
                            ?   (<div>
                                    <div className="flex gap-2">
                                        <h1>Suburb:</h1>
                                        <input 
                                            className="font-thin bg-slate-100/40 px-1.5 py-0.5 mb-2 rounded-lg text-md outline-1" 
                                            value={data.key_location.suburb}
                                            onChange={(e) => editLabel(e, "suburb", "key_location")} 
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <h1>City: </h1>
                                        <input 
                                            className="font-thin bg-slate-100/40 px-1.5 py-0.5 rounded-lg text-md outline-1" 
                                            value={data.key_location.city} 
                                            onChange={(e) => editLabel(e, "city", "key_location")} 
                                        />
                                    </div>
                                </div>)
                            : <h1>{`${"Epping"}, ${"North Melbourne"}`}</h1>
                        } 
                    </div>

                    <hr className="border-t-1.5  border-slate-950 rounded-full w-full h-0 my-5" />

                    <div className="flex gap-2 text-left text-lg font-[300] w-full pl-6">
                        {
                          editing 
                            ? (<div className="flex flex-col w-full gap-1">
                                <span>🤩 Favourite Trip: </span>
                                <input className="text-lg w-full font-thin bg-slate-100/40 px-2 py-1 rounded-lg outline-1" value={data.weird_trip} onChange={(e) => editLabel(e, "weird_trip")} />
                            </div>) 
                            : <h1><span className="font-bold">🤩 Favourite Trip:</span> {data.weird_trip || "I drove around South Australia with my friends"}</h1>
                        }
                    </div>
                    
                    <hr className="border-t-1.5  border-slate-950 rounded-full w-full h-0 my-5" />
                    
                    <div className="mt-3 flex gap-2 text-left text-lg font-[300] w-full pl-6">
                        {
                          editing 
                            ? (<div className="flex flex-col w-full gap-1">
                                <span>🤔 Why give me a ride: </span>
                                <input className="text-lg w-full font-thin bg-slate-100/40 px-2 py-1 rounded-lg outline-1" value={data.weird_trip} onChange={(e) => editLabel(e, "weird_trip")} />
                            </div>) 
                            : <h1><span className="font-bold">🤔 Why give me a ride:</span> {data.weird_trip || "I am fun to hang out with and just need a bit of help right now."}</h1>
                        }
                    </div>
                </div>
            </div>
            
            <div className="text-lg font-thin px-40 my-10 w-full">
                {
                    editing 
                    ? <textarea className="font-thin min-h-[200px] bg-slate-100/40 px-4 py-2 w-full rounded-lg outline-1" value={data.description} onChange={(e) => editLabel(e, "description")} /> 
                    : <p className="">{data.description || "N/A"}</p>
                }
            </div>

            <div className="px-16 mt-20">
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
