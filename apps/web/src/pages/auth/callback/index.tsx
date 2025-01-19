import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/userContext";
import Loading from "@/components/Loading"; // Import the loading component

const CallbackPage = () => {
  const router = useRouter();
  const { setUserAndLogin } = useUser();
  const [isProcessing, setIsProcessing] = useState(true); // State to track processing status

  useEffect(() => {
    if (!router.isReady) return; // Wait until the router is ready

    const processCallback = async () => {
      const { accessToken, refreshToken, user: userString } = router.query;

      if (accessToken && refreshToken) {
        // Store tokens in local storage
        localStorage.setItem("accessToken", accessToken as string);
        localStorage.setItem("refreshToken", refreshToken as string);

        if (userString) {
          try {
            // Parse user data
            const user = JSON.parse(userString as string);
            localStorage.setItem("user", JSON.stringify(user));

            // Update the user in the global context
            setUserAndLogin(user);

            // Redirect to homepage and refresh the page
            window.location.href = "/";
          } catch (err) {
            console.error("Error parsing user data:", err);

            // Redirect to the homepage on error
            window.location.href = "/";
          }
        } else {
          console.warn("User data is missing in the query. Redirecting to homepage...");
          window.location.href = "/";
        }
      } else {
        console.warn("Access or refresh token is missing. Redirecting to homepage...");
        window.location.href = "/";
      }

      // Ensure processing state is updated
      setIsProcessing(false);
    };

    processCallback();
  }, [router.isReady, router.query, setUserAndLogin]);

  // Show loading component while processing
  if (isProcessing) {
    return <Loading />;
  }

  return null; // Render nothing after processing is complete
};

export default CallbackPage;