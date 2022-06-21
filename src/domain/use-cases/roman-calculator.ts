export interface CalculateRoman {
    addition (number1: string, number2: string): Promise<string>
    subtraction (number1: string, number2: string): Promise<string>
}

export type Roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }