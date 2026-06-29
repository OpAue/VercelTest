import type { DiaryItem } from "../src/types";

const API_BASE_URL = "/api";
const DIARIES_URL = `${API_BASE_URL}/diaries`;

const requestJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const fetchDiaries = async (): Promise<DiaryItem[]> => {
  return requestJson<DiaryItem[]>(DIARIES_URL);
};

export const createDiary = async (diary: DiaryItem): Promise<DiaryItem> => {
  return requestJson<DiaryItem>(DIARIES_URL, {
    method: "POST",
    body: JSON.stringify(diary),
  });
};

export const updateDiary = async (diary: DiaryItem): Promise<DiaryItem> => {
  return requestJson<DiaryItem>(`${DIARIES_URL}/${diary.id}`, {
    method: "PUT",
    body: JSON.stringify(diary),
  });
};

export const deleteDiary = async (id: number | string): Promise<void> => {
  await requestJson<void>(`${DIARIES_URL}/${id}`, {
    method: "DELETE",
  });
};

export const mockApi = {
  baseUrl: API_BASE_URL,
  diaries: DIARIES_URL,
};
