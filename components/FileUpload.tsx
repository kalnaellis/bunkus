"use client";

import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  onFilesChange: (files: File[]) => void;
  files: File[];
  disabled?: boolean;
};

export default function FileUpload({ onFilesChange, files, disabled }: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled,
    multiple: true,
    maxSize: 20 * 1024 * 1024,
    onDrop: (accepted) => {
      onFilesChange([...files, ...accepted]);
    }
  });

  const fileNames = useMemo(() => files.map((f) => f.name), [files]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`rounded-lg border border-dashed p-6 text-center transition ${
          isDragActive ? "border-accent bg-accent/10" : "border-white/30"
        } ${disabled ? "opacity-60" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-white/70">Drop files here or click to browse</p>
      </div>

      {fileNames.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-white/65">
          {fileNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
