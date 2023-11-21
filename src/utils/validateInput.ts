export interface InputStatus {
  valid: boolean;
  error?: string;
}

type Rule = (value: string) => InputStatus;

export function isRequired(value: string): InputStatus {
  console.log(value);
  const valid = Boolean(value);
  return {
    valid,
    error: valid ? undefined : "Obligatoire",
  };
}

export function validate(value: string, rules: Rule[]): InputStatus {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.valid) {
      return result;
    }
  }
  return {
    valid: true,
  };
}
