import maxmind, { CityResponse } from "maxmind";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const openMaxmind = () =>
  maxmind.open<CityResponse>(
    path.join(__dirname, "..", "..", ".maxmind", "GeoLite2-City.mmdb"),
  );
