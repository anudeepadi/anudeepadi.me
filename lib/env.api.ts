// Validate env variables
function checkValue<T>(
  value: T | undefined,
  errorMsg: string,
  url?: string
): T {
  if (value === undefined) {
    throw new Error(
      `Missing Environment Variable: ${errorMsg}\n\nVisit ${url} to learn how you can generate your own API keys`
    );
  }
  return value;
}

// sample

// Required Sanity Configuration
export const projectId = checkValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "https://sanity.io"
);

export const dataset = checkValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
  "https://sanity.io"
);

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-26";

// Optional Sanity Configuration
export const token = process.env.NEXT_PUBLIC_SANITY_ACCESS_TOKEN;
export const hookSecret = process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET;
export const mode = process.env.NODE_ENV;

// Required Giscus Configuration
export const giscusRepo = "anudeepadi/anudeepadi.me";
export const giscusRepoId = "R_kgDONVUFow";
export const giscusCategory = "General";
export const giscusCategoryId = "DIC_kwDONVUFo84Ckoei";

// Optional Analytics Configuration
export const umamiSiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;