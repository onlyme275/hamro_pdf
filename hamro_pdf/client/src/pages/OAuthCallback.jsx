import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthError = (error) => {
      const decodedError = decodeURIComponent(error);
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            error: decodedError,
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate(`/login?error=${error}`);
      }
    };

    const handleOAuthSuccess = (token, userStr) => {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "OAUTH_SUCCESS",
              token,
              user,
            },
            window.location.origin
          );
          window.close();
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
          switch (user.role) {
            case "admin":
              navigate("/dashboard/admin");
              break;
            case "premium":
              navigate("/dashboard/premium");
              break;
            case "user":
              navigate("/dashboard/user");
              break;
            default:
              navigate("/");
          }
        }
      } catch (parseError) {
        console.error("Failed to parse user data:", parseError);
        handleOAuthParseError();
      }
    };

    const handleOAuthParseError = () => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            error: "Failed to process authentication data",
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate("/login?error=auth_failed");
      }
    };

    const handleOAuthNoData = () => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "OAUTH_ERROR",
            error: "No authentication data received",
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate("/login?error=no_auth_data");
      }
    };

    const handleCallback = () => {
      const token = searchParams.get("token");
      const userStr = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        handleOAuthError(error);
        return;
      }

      if (token && userStr) {
        handleOAuthSuccess(token, userStr);
      } else {
        handleOAuthNoData();
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Completing authentication...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please wait while we verify your credentials
        </p>
      </div>
    </div>
  );
}
