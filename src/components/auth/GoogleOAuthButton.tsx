"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { parseJwtToken, googleLoginApi } from "@/lib/api";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "849041457673-2m099uebbrshuvl3tl1ovjd9bk7r8nri.apps.googleusercontent.com";

interface GoogleOAuthButtonProps {
  label?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function GoogleOAuthButton({
  label = "Google के साथ जारी रखें",
  onSuccess,
  className = "",
}: GoogleOAuthButtonProps) {
  const { loginUser } = useCart();
  const [loading, setLoading] = useState(false);

  // Dynamically load Google Identity Services SDK
  useEffect(() => {
    if (typeof window === "undefined") return;
    const scriptId = "google-gsi-client";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Process user profile and log into CartContext
  const completeLogin = async (token: string, profile: { name?: string; email?: string; picture?: string; sub?: string }) => {
    try {
      // 1. Send token to backend if live API is running
      try {
        const backendRes = await googleLoginApi(token);
        if (backendRes && (backendRes.access_token || backendRes.token)) {
          const userToken = backendRes.access_token || backendRes.token;
          const user = backendRes.user || parseJwtToken(userToken) || {};
          loginUser(userToken, {
            id: user.id || Date.now(),
            name: user.name || profile.name || "भक्त श्रद्धालु",
            email: user.email || profile.email || "devotee@hargharmandir.com",
            avatarUrl: user.avatarUrl || user.picture || profile.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
            role: user.role || "CUSTOMER",
          });
          setLoading(false);
          if (onSuccess) onSuccess();
          return;
        }
      } catch (err) {
        console.warn("Backend sync notice, proceeding with verified Google profile:", err);
      }

      // 2. Client-side authentication with verified Google account
      loginUser(token, {
        id: profile.sub ? parseInt(profile.sub.slice(-6), 10) || Date.now() : Date.now(),
        name: profile.name || "भक्त श्रद्धालु",
        email: profile.email || "devotee@hargharmandir.com",
        avatarUrl: profile.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        role: "CUSTOMER",
      });

      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Login completion error:", e);
      setLoading(false);
    }
  };

  // Main Google Sign-In Trigger
  const handleGoogleClick = () => {
    if (typeof window === "undefined") return;
    setLoading(true);

    // Method 1: Google Identity Services Token Client (Modern Popup)
    if ((window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setLoading(false);
              if (tokenResponse.error !== "popup_closed_by_user") {
                alert("Google Sign-In Error: " + (tokenResponse.error_description || tokenResponse.error));
              }
              return;
            }

            try {
              // Fetch user profile from Google UserInfo endpoint
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: "Bearer " + tokenResponse.access_token },
              });
              const googleUser = await userInfoRes.json();
              await completeLogin(tokenResponse.access_token, googleUser);
            } catch (err) {
              console.error("Google user info error:", err);
              setLoading(false);
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (e) {
        console.warn("TokenClient error, falling back to popup:", e);
      }
    }

    // Method 2: Fallback OAuth 2.0 Popup
    const origin = window.location.origin;
    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
      encodeURIComponent(GOOGLE_CLIENT_ID) +
      "&redirect_uri=" +
      encodeURIComponent(origin + "/account") +
      "&response_type=token&scope=email%20profile%20openid";

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      authUrl,
      "GoogleSignIn",
      "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top
    );

    const interval = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval);
          setLoading(false);
          return;
        }

        if (popup.location.href.includes("access_token=")) {
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          popup.close();
          clearInterval(interval);

          if (accessToken) {
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: "Bearer " + accessToken },
            });
            const googleUser = await userInfoRes.json();
            await completeLogin(accessToken, googleUser);
          }
        }
      } catch (e) {
        // Cross-origin restriction until redirected to local origin
      }
    }, 500);
  };

  return (
    <div className={"w-full relative " + className}>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 text-zinc-800 font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-75 group"
      >
        {/* Official Google G Logo SVG */}
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="font-extrabold text-zinc-800 group-hover:text-zinc-950">
          {loading ? "Google से जुड़ रहा है..." : label}
        </span>
      </button>
    </div>
  );
}
