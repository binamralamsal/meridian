import maxmind, { CityResponse } from "maxmind";
import path from "path";

const lookup = await maxmind.open<CityResponse>(
  path.join(import.meta.dirname, ".maxmind", "GeoLite2-City.mmdb"),
);
console.log(lookup.get("27.34.68.17").sub); // inferred type maxmind.CityResponse
