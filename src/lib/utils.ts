import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitaire central pour fusionner les classes Tailwind de manière sûre.
 * Résout les conflits de classes (ex: px-2 py-2 px-4 -> py-2 px-4)
 * Permet l'usage objets/conditions (ex: { 'bg-red-500': hasError })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
