const API_BASE = 'https://api.arasaac.org/api';

export async function searchPictograms(locale = 'es', query = '', fetchOptions = {}) {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const response = await fetch(
        `${API_BASE}/pictograms/${locale}/search/${encodeURIComponent(trimmed)}`,
        fetchOptions
    );
    if (!response.ok) {
        throw new Error('No se pudo obtener pictogramas de ARASAAC');
    }

    return response.json();
}

export function pictoUrl(id, size = 500) {
    if (!id) return '';
    return `https://static.arasaac.org/pictograms/${id}/${id}_${size}.png`;
}
