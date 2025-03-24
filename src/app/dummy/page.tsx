// "use client"

// import React, { useState } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

// function FormDialog() {
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <>
//       <Button variant="contained" onClick={handleClickOpen}>
//         Open Form
//       </Button>
      
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Form Input</DialogTitle>
//         <DialogContent>
//           <TextField autoFocus margin="dense" label="Nama" fullWidth />
//           <TextField margin="dense" label="Email" type="email" fullWidth />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleClose}>Submit</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// export default FormDialog;

"use client"
import React, { useState } from "react";
import { Button } from "@mui/material";
import FormDialog from "@/components/reuse_component/testform";

function MainComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Form
      </Button>

      <FormDialog open={open} handleClose={() => setOpen(false)} />
    </>
  );
}

export default MainComponent;
