import { useEffect } from "react";
import { apiClient } from "../api/apiClient";
import { authStore } from "../store/auth.store";
import { useNavigate } from "react-router";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const setIsAuthenticated = authStore((s: any) => s.setIsAuthenticated);
  const setIsChecking = authStore((s: any) => s.setIsChecking);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await apiClient.get("/api/auth/me");
        console.log(response.data);
        if (response.data.success == true) {
          setIsAuthenticated(true);
          setIsChecking(false);
          console.log(response.data);
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          navigate("/auth", {
            replace: true,
          });
        }
      } catch {
        navigate("/auth", {
          replace: true,
        });
      }
    };

    authenticate();
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default OAuthCallback;
