import { fetchWithChallenge } from "./challenge.service";

export interface ApiUser {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface UsersResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: ApiUser[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchUsers(accessToken: string): Promise<ApiUser[]> {
  const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_LARAVEL_API_URL is not defined");

  const res = await fetchWithChallenge(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const json: UsersResponse = await res.json();

  if (!json.status) {
    throw new Error(json.message || "Failed to fetch users");
  }

  return json.data.data;
}