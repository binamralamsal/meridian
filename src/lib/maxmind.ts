import maxmind, { CityResponse } from "maxmind";
import path from "path";

export const maxmindLookup = await maxmind.open<CityResponse>(
  path.join(import.meta.dirname, "..", "..", ".maxmind", "GeoLite2-City.mmdb"),
);
