import Link from "next/link";

export default function Login() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-6">Log in</h1>
        <p className="text-sm text-gray-600">Please enter your details</p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="email"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="password"
            placeholder="password"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Log in
          </button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
