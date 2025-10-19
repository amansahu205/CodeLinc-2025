const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getSelections(token: string) {
    const res = await fetch(`${API_BASE}/selections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async saveSelection(token: string, planId: number) {
    const res = await fetch(`${API_BASE}/selections`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ plan_id: planId })
    });
    return res.json();
  },

  async chat(token: string, message: string) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  async enroll(token: string) {
    const res = await fetch(`${API_BASE}/enroll`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
