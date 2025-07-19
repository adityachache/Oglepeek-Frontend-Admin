import React from "react";
import { Button, TextField, Box } from "@mui/material";

type Props = {
  onUpload: (files: File[]) => void;
  selectedFiles: File[];
};

const FileUploadInput: React.FC<Props> = ({ onUpload, selectedFiles }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files); // Send files to parent component
    }
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        accept="image/*"
        multiple
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Button to trigger file input */}
      <label htmlFor="upload-button">
        <Button variant="contained" component="span">
          Upload Images
        </Button>
      </label>

      {/* Show selected file names */}
      <Box mt={2}>
        <TextField
          label="Selected Image Names"
          value={selectedFiles?.map((f) => f.name).join(", ") || ""}
          fullWidth
          multiline
          rows={3}
          slotProps={{ input: { readOnly: true } }}
        />
      </Box>
    </Box>
  );
};

export default FileUploadInput;
