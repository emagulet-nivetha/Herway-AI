import { Link } from "react-router-dom";
import { Compass, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function NotFound() {
  return (
    <div className="container-hw flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <Logo size="lg" />
      <p className="mt-8 font-heading text-6xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-charcoal sm:text-3xl">
        We couldn't find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-charcoal-muted">
        The page may have moved, or the link might be incorrect. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button leftIcon={<HomeIcon className="h-4 w-4" />}>Back to home</Button>
        </Link>
        <Link to="/marketplace">
          <Button variant="outline" leftIcon={<Compass className="h-4 w-4" />}>
            Explore marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}