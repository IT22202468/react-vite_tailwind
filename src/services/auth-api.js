const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(form) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (err) {
        console.error(err);
        return { ok: false, data: { message: 'Error logging in' } };
    }
}

export async function registerUser(form) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (err) {
        console.error(err);
        return { ok: false, data: { message: 'Error registering user' } };
    }
}