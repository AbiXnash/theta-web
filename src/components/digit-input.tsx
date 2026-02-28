import { component$, $, type PropFunction } from "@builder.io/qwik";

interface DigitInputProps {
  value: string;
  onInput$: PropFunction<(value: string) => void>;
  maxLength?: number;
  placeholder?: string;
}

export const DigitInput = component$<DigitInputProps>(
  ({ value, onInput$, maxLength = 10, placeholder = "" }) => {
    const digits = value.padEnd(maxLength, " ").split("");

    const handleKeyDown = $((e: KeyboardEvent, index: number) => {
      const input = e.target as HTMLInputElement;

      if (e.key === "Backspace") {
        if (input.value === "" && index > 0) {
          const prevInput = document.getElementById(
            `digit-${index - 1}`,
          ) as HTMLInputElement;
          prevInput?.focus();
        }
        const newValue = value.slice(0, -1);
        onInput$(newValue);
      } else if (e.key.length === 1 && /\d/.test(e.key)) {
        let newValue = value + e.key;
        if (newValue.length > maxLength) {
          newValue = newValue.slice(-maxLength);
        }
        onInput$(newValue);

        if (index < maxLength - 1) {
          const nextInput = document.getElementById(
            `digit-${index + 1}`,
          ) as HTMLInputElement;
          nextInput?.focus();
        }
      }
      e.preventDefault();
    });

    const handleInput = $((e: Event, index: number) => {
      const input = e.target as HTMLInputElement;
      const char = input.value.replace(/\D/g, "");

      if (char) {
        input.value = char;
        let newValue = value.slice(0, index) + char + value.slice(index + 1);
        if (newValue.length > maxLength) {
          newValue = newValue.slice(-maxLength);
        }
        onInput$(newValue);

        if (index < maxLength - 1) {
          const nextInput = document.getElementById(
            `digit-${index + 1}`,
          ) as HTMLInputElement;
          nextInput?.focus();
        }
      }
    });

    const handlePaste = $((e: ClipboardEvent) => {
      e.preventDefault();
      const paste = e.clipboardData
        ?.getData("text")
        .replace(/\D/g, "")
        .slice(0, maxLength);
      if (paste) {
        onInput$(paste);
      }
    });

    return (
      <div class="flex gap-1" onPaste$={handlePaste}>
        {Array.from({ length: maxLength }, (_, i) => (
          <input
            key={i}
            id={`digit-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i]}
            onInput$={(e) => handleInput(e, i)}
            onKeyDown$={(e) => handleKeyDown(e, i)}
            class="input input-bordered h-12 w-10 text-center font-mono text-lg"
            style={{ textAlign: "right" }}
            placeholder={i === maxLength - 1 ? placeholder : ""}
          />
        ))}
      </div>
    );
  },
);
