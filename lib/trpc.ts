import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // For web preview in development
  if (Platform.OS === 'web' && process.env.NODE_ENV === 'development') {
    return window.location.origin;
  }
  
  // For web preview in production (Netlify)
  if (Platform.OS === 'web' && process.env.NODE_ENV === 'production') {
    // Use the current origin (Netlify URL)
    return window.location.origin;
  }
  
  // For native development
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback for web
  if (Platform.OS === 'web') {
    return window.location.origin;
  }

  // Fallback URL
  return "https://api.spaceshare.app";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => {
        return {
          'Content-Type': 'application/json',
        };
      },
    }),
  ],
});