import { getHeader } from "@tanstack/react-start/server";

export function getIPAddress() {
  return getHeader("x-forwarded-for");
}

export async function getCurrentLocation() {
  if (getHeader("cf-ipcountry")) {
    const country = getHeader("cf-ipcountry");
    const city = getHeader("cf-ipcity");
    const region = getHeader("cf-region");

    console.log("Cloudflare IP Geolocation:", {
      country,
      city,
      region,
    });
  }
}
