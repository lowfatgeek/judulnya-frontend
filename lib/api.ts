export interface VideoObject {
  source: "search" | "people_also_watched" | "related_fallback";
  rank: number;
  title: string;
  channel_name: string;
  video_id: string;
  video_url: string;
  views_raw: string;
  views_num: number | null;
  published_raw: string | null;
  duration_raw: string | null;
}

export interface Template {
  template_text: string;
  example_1: string;
  example_2: string;
}

export interface StatusResponse {
  job_id: string;
  keyword: string;
  status: "queued" | "running" | "success" | "partial" | "failed";
  hl: string;
  gl: string;
  search_top: VideoObject[];
  people_also_watched_top: VideoObject[] | [];
  related_fallback_top: VideoObject[] | [];
  templates: Template[];
  error_message: string | null;
}

export interface JobQueuedResponse {
  job_id: string;
  status: "queued";
  cached: false;
}

export interface JobCachedResponse {
  job_id: string;
  status: "success";
  cached: true;
  result: StatusResponse;
}

export type CollectResponse = JobQueuedResponse | JobCachedResponse;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function collectYoutube(keyword: string, force_refresh: boolean = false): Promise<CollectResponse> {
  const res = await fetch(`${API_BASE_URL}/api/collect/youtube`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, force_refresh }),
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API Error: ${res.status} ${errorText}`);
  }
  
  return res.json();
}

export async function checkStatus(job_id: string): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/collect/status/${job_id}`);
  
  if (!res.ok) {
     const errorText = await res.text().catch(() => res.statusText);
     throw new Error(`API Error: ${res.status} ${errorText}`);
  }
  
  return res.json();
}
