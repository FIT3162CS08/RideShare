"use client"
import Loading from "@/component/Loading";
import AchievementCard from "@/component/profile/AchievementCard";
import { useFetch } from "@/useHook/useFetch";
import { useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();

  const { data, loading, error } = useFetch("s")
  console.log(data, loading, error)


  if (loading) {
    return (
      <Loading />
    )
  }
  
  return (
    <main className="flex flex-col items-center justify-start font-serif py-2">
      <h1 className="mt-10 w-fit text-5xl font-light text-shadow-2xs text-shadow-slate-500">ABOUT</h1>
      <h1 className="mt-22 w-fit text-3xl font-thin text-shadow-2xs text-shadow-slate-500">Profile</h1>
      <div className="mt-10 flex gap-25 justify-center">
        <div className="w-1/3 h-fit rounded-4xl overflow-clip">
          <img className="bg-blue-400 w-full rounded-4xl aspect-1/1" src={data.user_url} />
        </div>
        <div className="w-5/12 flex flex-col  items-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-2xl font-thin">{data.name}</h1> | 
            <h1 className="text-md font-thin">Verified Monash Student</h1>
          </div>
          <h3 className="text-xl font-thin my-5 text-shadow-2xs text-shadow-amber-50">{data.trips_count} trips in total</h3>
          <p className="text-lg  font-thin">{data.description}</p>
        </div>
      </div>
      <div className="px-16">
        <h2 className="mt-10 text-3xl text-shadow-2xs text-shadow-slate-500 ">Achievements</h2>
        <div className="flex gap-8 mt-6 w-full overflow-x-scroll">
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
          <AchievementCard title={"Trustworthy"} description={"This user has a high rating"} img_url={"https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-woman-motorcyclist-in-leather-jacket-and-helmet-clipart-illustration-png-image_14864569.png"}/>
        </div>
      </div>
    </main>
    );
}
