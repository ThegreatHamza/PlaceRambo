import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-12">
      <div className="text-center">
        <div className="text-7xl font-extrabold text-teal-100">404</div>
        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          The page you are looking for doesn't exist or may have moved. Let's get you back to the marketplace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/search" className="btn btn-ghost">
            <Search className="h-4 w-4" /> Search
          </Link>
        </div>
      </div>
    </div>
  );
}
