import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Demo credentials
      const managerEmail = "manager@ptieasy.com";
      const driverEmail = "driver@ptieasy.com";
      const password = "demo123";

      if (formData.password !== password) {
        toast.error("Invalid password");
        setIsLoading(false);
        return;
      }

      if (formData.email === managerEmail) {
        localStorage.setItem("pti_auth", "true");
        localStorage.setItem("pti_role", "manager");
        toast.success("Welcome back, Fleet Manager!");
        navigate("/dashboard");
      } else if (formData.email === driverEmail) {
        localStorage.setItem("pti_auth", "true");
        localStorage.setItem("pti_role", "driver");
        toast.success("Welcome back, Driver!");
        navigate("/driver");
      } else {
        toast.error("Invalid email address");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pti-blue-50 to-pti-blue-100 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pti-blue text-white">
              <ClipboardCheck className="h-7 w-7" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-pti-gray-800">
              PTI Easy
            </CardTitle>
            <CardDescription className="text-pti-gray-600 mt-2">
              Fleet Management Dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-pti-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dispatcher@company.com"
                value={formData.email}
                onChange={handleInputChange}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-pti-gray-700 font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-11 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-pti-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-pti-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-pti-blue hover:bg-pti-blue-600 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                className="text-pti-blue hover:text-pti-blue-600 text-sm"
              >
                Forgot Password?
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t text-center space-y-2">
            <p className="text-xs font-medium text-pti-gray-700">
              Demo Credentials:
            </p>
            <div className="text-xs text-pti-gray-600 space-y-1">
              <div>
                <strong>Manager:</strong> manager@ptieasy.com
              </div>
              <div>
                <strong>Driver:</strong> driver@ptieasy.com
              </div>
              <div>
                <strong>Password:</strong> demo123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
