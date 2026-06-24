/**
 * Type-level transformation: converts snake_case string literal types to camelCase.
 * Example: "project_id" -> "projectId"
 */
export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

/**
 * Runtime utility for converting snake_case keys to camelCase.
 */
export function toCamelCase<T extends string>(str: T): SnakeToCamelCase<T> {
  return str.replace(/(_[a-z])/g, (match) =>
    match.toUpperCase().replace('_', '')
  ) as SnakeToCamelCase<T>;
}

/**
 * Deeply transforms object keys from snake_case to camelCase at the type level.
 */
export type CamelCaseKeys<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: CamelCaseKeys<T[K]>;
    }
  : T;
