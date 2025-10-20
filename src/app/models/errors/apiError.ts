export interface ApiError {
    code: number;
    title: string;
    detail?: string;
}

export const errorMessages: Record<number, string> = {
    477: 'A megadott adatok formátuma hibás.',
    2781: 'A megadott adat hossza érvénytelen.',
    572: 'Érvénytelen beállítási lehetőséget adott meg.',
    4481: 'A választott járat a megadott napon nem közlekedik.',
    8791: 'A járat ülésrendje a megadott dátumra nem érhető el.',
    32171: 'Hiányzik egy kötelező adat.',
    404: 'A kért adat nem található.',
    500: 'Váratlan hiba történt a kiszolgáló oldalon. Kérjük, próbálja meg később.',
};
