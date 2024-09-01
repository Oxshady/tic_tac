 import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();
export async function NewUser({name, email, password }) {
    try {
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": name,
                "email":email,
                "password":password
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function fetchUsers() {
    const response= await fetch('http://localhost:5000/users');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
    }
    // return all users email and name
    const data = await response.json();
    
    return data;
}

export async function login({ email, password }) {
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            let errorMessage = 'An error occurred';
            if (response.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (response.status === 400) {
                errorMessage = 'Bad request';
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Rethrow the error to be handled by useMutation
    }
}


// return win - lose - number played- name
export async function fetchProfile() {
    const data = await fetch('http://localhost:2000/profile');
    if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
    }
    // print all scores and data prfile form database (name - win - lose - number played- name)
    console.log(data.json())
    return data.json();
}
