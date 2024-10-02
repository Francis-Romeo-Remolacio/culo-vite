import { ChangeEvent, SetStateAction, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

type ManualAddDialogProps = {
  open: boolean;
  setOpenAddModal: (value: SetStateAction<boolean>) => void;
  handleSubmit: (data: any) => Promise<void>;
};

const ManualAddDialog = ({
  open,
  setOpenAddModal,
  handleSubmit,
}: ManualAddDialogProps) => {
  const [formData, setFormData] = useState({
    designTagName: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCancel = () => {
    // Close the dialog and clear the text field
    setOpenAddModal(false);
    setFormData({ designTagName: "" });
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Create New Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new design tag:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="designTagName"
            name="designTagName"
            label="Design Tag Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.designTagName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" sx={{ mr: 2 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit(formData);
              setOpenAddModal(false);
              setFormData({ designTagName: "" });
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManualAddDialog;
