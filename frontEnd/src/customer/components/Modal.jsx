import { Box, Modal as MuiModal } from "@mui/material"; // Alias MuiModal to avoid naming conflict
import React from "react";
import { useLocation } from "react-router-dom";
import CreateEvent from "./CreateEvent"; // Assuming CreateEvent is in the correct path

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Responsive width
  maxWidth: 500, // Prevents being too large
  minWidth: 300, // Ensures usability on small screens
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: { xs: 2, sm: 4 }, // Smaller padding for small screens
};

const Modal = ({ handleClose, open }) => {
  const location = useLocation();

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <CreateEvent />
      </Box>
    </MuiModal>
  );
};

export default Modal;
