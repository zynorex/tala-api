import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
      <div className="card text-center">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Link href="/" className="btn-primary inline-block">
          GO HOME
        </Link>
      </div>
    </div>
  );
}
