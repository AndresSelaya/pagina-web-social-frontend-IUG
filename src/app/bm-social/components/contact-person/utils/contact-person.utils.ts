// filepath: c:\Users\Iamfab\Desktop\pagina-web-social-frontend-IUG\src\app\bm-social\components\contact-person\utils\contact-person.utils.ts

export function formatContactPersonName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}

export function validateContactPersonEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function generateContactPersonId(): string {
    return 'CP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}