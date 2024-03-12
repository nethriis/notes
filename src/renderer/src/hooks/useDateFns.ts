import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const useDateFns =
	() => ({ format: (date: Date, pattern: string) => format(date, pattern, { locale: fr }) })
