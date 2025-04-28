import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'\;

class ApiService {
  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  }
}

export const api = new ApiService();

// Define our API types
export interface Member {
  id: number;
  email: string;
  name?: string;
  joinedAt: string;
  status: string;
  discordId?: string;
  discordRole?: string;
  duesExpiry?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  actionNetworkId?: string;
  googleCalendarId?: string;
  discordEventId?: string;
  attendees?: EventAttendee[];
}

export interface EventAttendee {
  id: number;
  memberId: number;
  eventId: number;
  status: string;
  member?: Member;
}

// API-specific endpoints
export const membersApi = {
  getAll: (page = 1, limit = 10) => api.get<{ items: Member[]; total: number }>(`/api/members?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get<Member>(`/api/members/${id}`),
  create: (data: { email: string; name?: string }) => api.post<Member>('/api/members', data),
  updateStatus: (id: number, status: string) => api.put<Member>(`/api/members/${id}/status`, { status }),
  getExpiringSoon: (days = 30) => api.get<Member[]>(`/api/members/due-expiring?days=${days}`),
};

export const eventsApi = {
  getAll: (upcoming = true) => api.get<Event[]>(`/api/events?upcoming=${upcoming}`),
  getById: (id: number) => api.get<Event>(`/api/events/${id}`),
  create: (data: Omit<Event, 'id'>) => api.post<Event>('/api/events', data),
  register: (eventId: number, memberId: number) => api.post<EventAttendee>(`/api/events/${eventId}/register`, { memberId }),
};
