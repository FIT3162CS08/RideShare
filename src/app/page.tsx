import Image from "next/image";

export default function HomePage() {
  return (
    <section>
    <div className = "px-50">Travel to campus with RideShare</div>
    <div className = "px-50">Log in to see your account details</div>
    <div className = "px-50">Request rides, view past trips, tailored suggestions and more.</div>
    <button className = "px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">Log in to your account</button>
    <div className = "px-50">Create account</div>
    </section>
  );
}
