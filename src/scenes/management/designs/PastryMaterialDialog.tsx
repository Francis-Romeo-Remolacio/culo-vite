import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { PastryMaterial } from "../../../utils/Schemas";

type PastryMaterialDialogProps = {
  pastryMaterial?: PastryMaterial;
  open: boolean;
};
const PastryMaterialDialog = ({
  pastryMaterial,
  open,
}: PastryMaterialDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default PastryMaterialDialog;
