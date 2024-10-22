import { IconButton, Stack, TextField } from "@mui/material";
import {
  Add as IncreaseIcon,
  Remove as DecreaseIcon,
} from "@mui/icons-material";

type NumberCounterProps = {
  value: number;
  onChange: (method: string) => void;
  key?: string;
  disabled?: boolean;
  label?: string;
  small?: boolean;
};

const NumberCounter = ({
  value,
  onChange,
  key,
  disabled,
  label,
  small,
}: NumberCounterProps) => {
  return (
    <Stack direction="row">
      <IconButton onClick={() => onChange("decrement")} disabled={disabled}>
        <DecreaseIcon />
      </IconButton>
      <TextField
        label={label ?? "Quantity"}
        id={key ?? "quantity"}
        name={key ?? "quantity"}
        value={value}
        slotProps={{
          htmlInput: {
            type: "number",
            min: 1,
            max: 10,
          },
        }}
        size={small ? "small" : "medium"}
        disabled={disabled}
      />
      <IconButton onClick={() => onChange("increment")} disabled={disabled}>
        <IncreaseIcon />
      </IconButton>
    </Stack>
  );
};

export default NumberCounter;
