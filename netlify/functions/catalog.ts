import type { Config } from "@netlify/functions";
import { CATALOG } from "../../lib/catalog.js";

export default async () =>
  Response.json(CATALOG, { headers: { "Cache-Control": "public, max-age=300" } });

export const config: Config = { path: "/api/catalog", method: "GET" };
