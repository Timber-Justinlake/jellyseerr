import type { MultiValue, SingleValue } from 'react-select';
import { z } from 'zod';

export const ExcludableSingleVal = z.object({
  label: z.coerce.string(),
  value: z.coerce.number(),
  excluded: z.coerce.boolean(),
});
export type ExcludableSingleVal = z.infer<typeof ExcludableSingleVal>;

/**
 * Type assertion function to narrow type of dropdown selection to Single Value
 */
export function isSingleValue(
  val: unknown
): val is SingleValue<ExcludableSingleVal> {
  const result = ExcludableSingleVal.safeParse(val);
  return result.success || val === null;
}

/**
 * Type assertion function to narrow type of dropdown selection to Multi Value
 */
export function isMultiValue(
  val: unknown
): val is MultiValue<ExcludableSingleVal> {
  return Array.isArray(val) && val.every((i) => i !== null && isSingleValue(i));
}

/**
 * @returns A SingleValue with the 'excluded' property removed and the value to
 *          make it a SingleVal
 */
function convertToSingleVal({
  label,
  value,
  excluded,
}: ExcludableSingleVal): SingleValue<Omit<ExcludableSingleVal, 'excluded'>> {
  const prefix = excluded ? '-' : '';
  return {
    label,
    value: Number(`${prefix}${value}`),
  };
}

/**
 * @returns a SingleValue or MultiValue of SingleVal
 */
export function formatSingleVal(
  value: MultiValue<ExcludableSingleVal> | SingleValue<ExcludableSingleVal>
) {
  if (value === null) return value;
  return isMultiValue(value)
    ? value.map(convertToSingleVal)
    : convertToSingleVal(value);
}

/**
 * Removes the hyphen prefix from a string or number if present
 * @returns a string regardless of whether the input was a string or number
 */
export function stripPrefix(val: string | number) {
  return `${val}`.replace(/^-/, '');
}

export function isExcluded(val: string | number) {
  return `${val}`.startsWith('-');
}

function getExcludableIds(value: string, shouldExclude: boolean) {
  const separator = value.includes(',') ? ',' : '|';
  return value
    .split(separator)
    .map((v) => v.trim())
    .filter((v) => isExcluded(v) === shouldExclude)
    .map((v) => Number(v));
}

export function getIncludedIds(value: string | undefined) {
  return value ? getExcludableIds(value, false) : [];
}

export function getExcludedIds(value: string | undefined) {
  return value ? getExcludableIds(value, true) : [];
}

export function makeExcludedId(value: string | number) {
  const prefix = isExcluded(value) ? '' : '-';
  return Number(`${prefix}${value}`);
}
