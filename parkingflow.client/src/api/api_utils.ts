const baseUrl = import.meta.env.VITE_API_URL === undefined
    ? "" : import.meta.env.VITE_API_URL;

const tokenPrefix = "Bearer";

export async function ApiPost<TResult, TBody>(
    url: string,
    body: TBody,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `${tokenPrefix} ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        if (!response.headers.get('Content-Type')?.includes('application/json')) {
            return {} as TResult;
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiPost:', error);
        throw error;
    }
}

export async function ApiGet<TResult>(
    url: string,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `${tokenPrefix} ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        if (!response.headers.get('Content-Type')?.includes('application/json')) {
            return {} as TResult;
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiGet:', error);
        throw error;
    }
}

export async function ApiPut<TResult, TBody>(
    url: string,
    body: TBody,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `${tokenPrefix} ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        if (!response.headers.get('Content-Type')?.includes('application/json')) {
            return {} as TResult;
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiPut:', error);
        throw error;
    }
}

export async function ApiDelete<TResult>(
    url: string,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `${tokenPrefix} ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        if (!response.headers.get('Content-Type')?.includes('application/json')) {
            return {} as TResult;
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiDelete:', error);
        throw error;
    }
}