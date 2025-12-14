/**
 * UTILIDADES DE VALIDACIÓN PARA FORMULARIOS
 * 
 * Funciones de validación específicas para Chile y uso general
 */

/**
 * Valida RUT chileno con dígito verificador
 * @param {string} rut - RUT en formato 12.345.678-9 o 12345678-9 o 123456789
 * @returns {boolean} - true si el RUT es válido
 */
export function validateRUT(rut) {
    if (!rut) return false;

    // Limpiar el RUT (quitar puntos y guión)
    const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();

    // Verificar que tenga al menos 2 caracteres (cuerpo + DV)
    if (cleanRut.length < 2) return false;

    // Separar cuerpo y dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Verificar que el cuerpo sean solo números
    if (!/^\d+$/.test(body)) return false;

    // Algoritmo módulo 11
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDV = 11 - (sum % 11);
    let calculatedDV;

    if (expectedDV === 11) {
        calculatedDV = '0';
    } else if (expectedDV === 10) {
        calculatedDV = 'K';
    } else {
        calculatedDV = expectedDV.toString();
    }

    return dv === calculatedDV;
}

/**
 * Formatea RUT chileno con puntos y guión
 * @param {string} rut - RUT sin formato
 * @returns {string} - RUT formateado (ej: 12.345.678-9)
 */
export function formatRUT(rut) {
    if (!rut) return '';

    // Limpiar el RUT
    const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();

    if (cleanRut.length < 2) return cleanRut;

    // Separar cuerpo y DV
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Formatear el cuerpo con puntos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedBody}-${dv}`;
}

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number|null} - Edad en años o null si la fecha es inválida
 */
export function calculateAge(birthDate) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    // Verificar que la fecha sea válida
    if (isNaN(birth.getTime())) return null;

    // Verificar que la fecha no sea futura
    if (birth > today) return null;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * Calcula edad en meses (útil para lactantes y preescolares)
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number|null} - Edad en meses o null si la fecha es inválida
 */
export function calculateAgeInMonths(birthDate) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) return null;

    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const days = today.getDate() - birth.getDate();

    let totalMonths = years * 12 + months;

    // Ajustar si aún no ha cumplido el mes
    if (days < 0) {
        totalMonths--;
    }

    return totalMonths;
}

/**
 * Valida teléfono chileno
 * @param {string} phone - Teléfono
 * @returns {boolean} - true si el teléfono es válido
 */
export function validateChileanPhone(phone) {
    if (!phone) return false;

    // Limpiar el teléfono
    const cleanPhone = phone.replace(/[\s()-]/g, '');

    // Formatos válidos:
    // +56912345678 (móvil con código país)
    // 56912345678 (móvil con código país sin +)
    // 912345678 (móvil sin código país)
    // +56221234567 (fijo con código país)
    // 221234567 (fijo sin código país)

    const patterns = [
        /^\+?56[2-9]\d{8}$/,  // Fijo con código país (opcional +)
        /^[2-9]\d{8}$/,        // Fijo sin código país
        /^\+?569\d{8}$/,       // Móvil con código país (opcional +)
        /^9\d{8}$/             // Móvil sin código país
    ];

    return patterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * Formatea teléfono chileno
 * @param {string} phone - Teléfono sin formato
 * @returns {string} - Teléfono formateado
 */
export function formatChileanPhone(phone) {
    if (!phone) return '';

    const cleanPhone = phone.replace(/[\s()-]/g, '');

    // Si es móvil (empieza con 9)
    if (/^(\+?56)?9\d{8}$/.test(cleanPhone)) {
        const number = cleanPhone.replace(/^\+?56/, '');
        return `+56 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`;
    }

    // Si es fijo
    if (/^(\+?56)?[2-9]\d{8}$/.test(cleanPhone)) {
        const number = cleanPhone.replace(/^\+?56/, '');
        return `+56 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`;
    }

    return phone;
}

/**
 * Valida email
 * @param {string} email - Email
 * @returns {boolean} - true si el email es válido
 */
export function validateEmail(email) {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida que la edad coincida con el nivel escolar
 * @param {number} age - Edad en años
 * @param {string} gradeLevel - Nivel escolar (ej: "Kinder", "1° Básico", "Pre-kinder")
 * @returns {object} - { valid: boolean, warning: string|null }
 */
export function validateAgeGradeMatch(age, gradeLevel) {
    if (!age || !gradeLevel) return { valid: true, warning: null };

    const gradeLevelLower = gradeLevel.toLowerCase();

    // Mapeo de niveles escolares a edades esperadas
    const gradeAgeMap = {
        'sala cuna': [0, 1],
        'medio menor': [1, 2],
        'medio mayor': [2, 3],
        'pre-kinder': [3, 4],
        'kinder': [4, 5],
        'prekinder': [3, 4],
        'kínder': [4, 5],
        '1° básico': [5, 6],
        '1 básico': [5, 6],
        'primero básico': [5, 6],
        '2° básico': [6, 7],
        '2 básico': [6, 7],
        'segundo básico': [6, 7],
        '3° básico': [7, 8],
        '3 básico': [7, 8],
        'tercero básico': [7, 8],
        '4° básico': [8, 9],
        '4 básico': [8, 9],
        'cuarto básico': [8, 9],
        '5° básico': [9, 10],
        '5 básico': [9, 10],
        'quinto básico': [9, 10],
        '6° básico': [10, 11],
        '6 básico': [10, 11],
        'sexto básico': [10, 11],
        '7° básico': [11, 12],
        '7 básico': [11, 12],
        'séptimo básico': [11, 12],
        '8° básico': [12, 13],
        '8 básico': [12, 13],
        'octavo básico': [12, 13],
        '1° medio': [13, 14],
        '1 medio': [13, 14],
        'primero medio': [13, 14],
        '2° medio': [14, 15],
        '2 medio': [14, 15],
        'segundo medio': [14, 15],
        '3° medio': [15, 16],
        '3 medio': [15, 16],
        'tercero medio': [15, 16],
        '4° medio': [16, 17],
        '4 medio': [16, 17],
        'cuarto medio': [16, 17]
    };

    for (const [grade, [minAge, maxAge]] of Object.entries(gradeAgeMap)) {
        if (gradeLevelLower.includes(grade)) {
            if (age < minAge - 1 || age > maxAge + 2) {
                return {
                    valid: false,
                    warning: `La edad (${age} años) parece no coincidir con ${gradeLevel}. Edad esperada: ${minAge}-${maxAge} años.`
                };
            }
            return { valid: true, warning: null };
        }
    }

    return { valid: true, warning: null };
}

/**
 * Formatea fecha para input type="date"
 * @param {Date|string} date - Fecha
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export function formatDateForInput(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Obtiene descripción de edad en formato amigable
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {string} - Descripción de edad (ej: "3 años 6 meses")
 */
export function getAgeFriendlyDescription(birthDate) {
    if (!birthDate) return '';

    const ageYears = calculateAge(birthDate);
    const ageMonths = calculateAgeInMonths(birthDate);

    if (ageYears === null || ageMonths === null) return '';

    if (ageYears === 0) {
        return `${ageMonths} ${ageMonths === 1 ? 'mes' : 'meses'}`;
    }

    const remainingMonths = ageMonths % 12;

    if (remainingMonths === 0) {
        return `${ageYears} ${ageYears === 1 ? 'año' : 'años'}`;
    }

    return `${ageYears} ${ageYears === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
}
