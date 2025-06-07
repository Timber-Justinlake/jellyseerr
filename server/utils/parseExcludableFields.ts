export type FieldStr = string | undefined;
export type IncludedFields = FieldStr;
export type ExcludedFields = FieldStr;

/**
 * Takes a comma-separated string of fields and returns an object with two properties:
 * - `include` containing fields that do not start with a hyphen,
 * - `exclude` containing fields that start with a hyphen (without the hyphen).
 *
 * @returns a tuple where the first element is a string of included fields and
 *          second element is a string of excluded fields. Either element will be
 *          undefined if there were no values found for that field.
 */
export function parseExcludableFields(
  fieldsStr: FieldStr
): [IncludedFields, ExcludedFields] {
  if (!fieldsStr) return [undefined, undefined];

  const fields = fieldsStr.split(',').map((f) => f.trim());

  const include = fields.filter(withHyphen(false)).join(',') || undefined;
  const exclude =
    fields
      .filter(withHyphen(true))
      .map((f) => f.slice(1))
      .join(',') || undefined;

  return [include, exclude];
}

/**
 * Returns a filter function that checks if a string starts with a hyphen and
 * checks if that is the desired condition.
 */
function withHyphen(wantsHyphen: boolean) {
  return (val: string) => wantsHyphen === val.startsWith('-');
}
