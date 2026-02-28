import {
  createQwikCity,
  type PlatformNetlify,
} from "@builder.io/qwik-city/middleware/netlify-edge";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";

declare global {
  type QwikCityPlatform = PlatformNetlify;
}

export default createQwikCity({ render, qwikCityPlan });
