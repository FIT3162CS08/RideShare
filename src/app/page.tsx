import Image from "next/image";

export default function HomePage() {
  return (
    <section className = "px-8 md:px-20 lg:px-40 py-12">
    <div className = "space-y-4">
      <h1 className = "text-4xl font-bold">Travel to campus with RideShare</h1>
      <Image 
        src="/homepage.png"      
        alt="Uni Students illustration"
        width={500} 
        height={300} 
        className="rounded-lg "
      />

      <p className = "text-3xl"> Log in to see your account details</p>
      <p>Request rides, view past trips, tailored suggestions and more.</p>
      <button className = "text-xl px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">Log in to your account</button>
      <p className="underline">Create account</p> 
      </div>
    </section>
  );
}
