

import React, { FC } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
}

const FormDialog: FC<FormDialogProps> = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Form Input</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Nama" fullWidth />
        <TextField margin="dense" label="Email" type="email" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClose}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;