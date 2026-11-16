import { env } from "cloudflare:workers";

/**
 * Minimal shape of the Cloudflare static-assets binding.
 * `env.ASSETS` is configured in cloudflare.config.ts.
 */
export type DataAssetsEnv = {
  ASSETS?: {
    fetch(input: URL | Request | string): Promise<Response>;
  };
};

const FALLBACK_ORIGIN = "https://assets.internal";

export class DataFetchError extends Error {
  readonly path: string;
  readonly status: number;

  constructor(path: string, status: number) {
    super(`Data asset /data/${path} is unavailable (HTTP ${status})`);
    this.name = "DataFetchError";
    this.path = path;
    this.status = status;
  }
}

function getAssetsBinding(workerEnv?: DataAssetsEnv) {
  const assets =
    workerEnv?.ASSETS ?? (env as unknown as DataAssetsEnv | undefined)?.ASSETS;

  if (!assets) {
    throw new Error("Cloudflare ASSETS binding is not available");
  }

  return assets;
}

/**
 * Reads a JSON artifact from public/data through the Cloudflare ASSETS
 * binding instead of the (unavailable on Workers) project filesystem.
 *
 * Pass the incoming `request` when one exists so the URL is resolved against
 * the current origin. Only the pathname is used to match assets.
 */
export async function fetchDataJson<T>(
  path: string,
  options: { request?: Request; env?: DataAssetsEnv } = {}
): Promise<T> {
  const assets = getAssetsBinding(options.env);
  const url = new URL(`/data/${path}`, options.request?.url ?? FALLBACK_ORIGIN);
  const response = await assets.fetch(url);

  if (!response.ok) {
    throw new DataFetchError(path, response.status);
  }

  return (await response.json()) as T;
}
