import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pti-blue-50 to-pti-blue-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-pti-blue text-white">
            <ClipboardCheck className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-4 text-pti-gray-900">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-pti-gray-800">
          Page Not Found
        </h2>
        <p className="text-pti-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page may have
          been moved or doesn't exist.
        </p>

        <Button asChild className="bg-pti-blue hover:bg-pti-blue-600">
          <a href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
