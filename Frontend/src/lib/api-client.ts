/**
 * Ultra Pharma API Facade
 * This abstraction allows the frontend to stay decoupled from the transport layer.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = async <T>(
  channel: string,
  payload?: unknown,
): Promise<T> => {
  // Logic: In Web mode, we use fetch. In Electron mode, we would use IPC.
  const options: RequestInit = {
    method: payload ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization headers here if needed
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}/${channel}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "خطأ في الاتصال بالسيرفر");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${channel}]:`, error);
    throw error;
  }
};
