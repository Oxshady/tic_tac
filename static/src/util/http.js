import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();
export async function NewUser({ name, email, password }) {
    try {
        const response = await fetch('http://localhost:2000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User created with data:', data);
        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function fetchUsers() {
    const data = await fetch('http://localhost:2000/users');

    if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
    }
    return data.json();
}

export async function fetchProfile() {
    const data = await fetch('http://localhost:2000/profile');

    if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
    }
    return data.json();
}