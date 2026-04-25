import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="font-display text-8xl font-bold gradient-text mb-4">404</div>
          <h1 className="font-display text-2xl font-semibold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="hero" size="lg">
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
