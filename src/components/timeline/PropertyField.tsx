'use client';

import React from 'react';

type FieldType = 'text' | 'number' | 'color' | 'select' | 'boolean';

interface BaseFieldProps {
  label: string;
  type: FieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}

interface NumberFieldProps extends BaseFieldProps {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  options: { label: string; value: string }[];
}

type PropertyFieldProps = BaseFieldProps | NumberFieldProps | SelectFieldProps;

export function PropertyField(props: PropertyFieldProps) {
  const { label, type, value, onChange } = props;

  const inputClass =
    'h-7 w-full rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary';

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            className={inputClass}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'number': {
        const { min, max, step } = props as NumberFieldProps;
        return (
          <input
            type="number"
            className={inputClass}
            value={Number(value ?? 0)}
            min={min}
            max={max}
            step={step ?? 1}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        );
      }

      case 'color':
        return (
          <div className="flex h-7 items-center gap-1">
            <input
              type="color"
              className="h-7 w-8 cursor-pointer rounded border border-border p-0.5"
              value={String(value ?? '#000000')}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              className={inputClass}
              value={String(value ?? '#000000')}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case 'select': {
        const { options } = props as SelectFieldProps;
        return (
          <select
            className={inputClass}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      case 'boolean':
        return (
          <label className="flex h-7 items-center gap-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-border"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="text-xs text-muted-foreground">{value ? 'On' : 'Off'}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-7 items-center gap-2">
      <label className="w-[40%] shrink-0 truncate text-xs text-muted-foreground">{label}</label>
      <div className="w-[60%]">{renderInput()}</div>
    </div>
  );
}
