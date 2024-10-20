import { IconButton, Stack, TextField } from "@mui/material";
import {
  Add as IncreaseIcon,
  Remove as DecreaseIcon,
} from "@mui/icons-material";

type NumberCounterProps = {
  value: number;
  onChange: (method: string) => void;
  key?: string;
  label?: string;
  small?: boolean;
};

const NumberCounter = ({
  value,
  onChange,
  key,
  label,
  small,
}: NumberCounterProps) => {
  return (
    <Stack direction="row">
      <IconButton onClick={() => onChange("decrement")}>
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
      />
      <IconButton onClick={() => onChange("increment")}>
        <IncreaseIcon />
      </IconButton>
    </Stack>
  );
};

export default NumberCounter;
