import { IconButton, Stack, TextField } from "@mui/material";
import {
  Add as IncreaseIcon,
  Remove as DecreaseIcon,
} from "@mui/icons-material";

type NumberCounterProps = {
  value: number;
  handleChange: (method: string) => void;
};

const NumberCounter = ({ value, handleChange }: NumberCounterProps) => {
  return (
    <Stack direction="row">
      <IconButton onClick={() => handleChange("decrement")}>
        <DecreaseIcon />
      </IconButton>
      <TextField
        label="Quantity"
        id="quantity"
        name="quantity"
        value={value}
        slotProps={{
          htmlInput: {
            type: "number",
            min: 1,
            max: 10,
          },
        }}
      />
      <IconButton onClick={() => handleChange("increment")}>
        <IncreaseIcon />
      </IconButton>
    </Stack>
  );
};

export default NumberCounter;
