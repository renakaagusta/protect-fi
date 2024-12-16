import React from 'react';
import { Input } from '../input/input';
import { z } from 'zod';

export const parseTokenInput = (value: string): { value: number | null; error: string | null } => {
  if (!value) return { value: null, error: null };

  // Handle different token notation formats
  const formats = {
    standard: /^(\d*\.?\d*)[eE](-?\d+)$/, // 9e-12
    power: /^(\d*\.?\d*)\*10\^(-?\d+)$/, // 9*10^-12
    decimal: /^-?\d*\.?\d*$/ // 0.000000000009
  };

  try {
    let number, exponent;

    if (formats.power.test(value)) {
      [, number, exponent] = value.match(formats.power)!;
      return { value: Number(`${number}e${exponent}`), error: null };
    }

    if (formats.standard.test(value)) {
      [, number, exponent] = value.match(formats.standard)!;
      return { value: Number(`${number}e${exponent}`), error: null };
    }

    if (formats.decimal.test(value)) {
      const num = Number(value);
      return isNaN(num) ? { value: null, error: "Invalid number" } : { value: num, error: null };
    }

    return { value: null, error: "Invalid format" };
  } catch (err) {
    return { value: null, error: "Invalid number" };
  }
};
// Custom Zod schema for token notation
export const tokenNumberSchema = z.string().refine(
  (val) => {
    const { error, value } = parseTokenInput(val);
    return error === null && value !== null;
  },
  "Please enter a valid number in decimal, token (e.g., 9e-12), or power notation (e.g., 9*10^-12)"
);

interface TokenInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showPreview?: boolean;
  symbol?: string;
}

const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
  ({ showPreview = false, symbol = '', onChange, className, ...props }, ref) => {
    const [preview, setPreview] = React.useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, error } = parseTokenInput(e.target.value);

      if (value !== null && !error && showPreview) {
        setPreview(value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 18
        }));
      } else {
        setPreview('');
      }

      onChange?.(e);
    };

    return (
      <div className="space-y-1">
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            onChange={handleChange}
            className={className}
            {...props}
          />
          {symbol && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-500">{symbol}</span>
            </div>
          )}
        </div>
        {showPreview && preview && (
          <div className="text-sm text-blue-700">
            {preview}
          </div>
        )}
      </div>
    );
  }
);

TokenInput.displayName = "TokenInput";

export default TokenInput;