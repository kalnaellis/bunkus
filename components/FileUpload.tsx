"use client";

type FileUploadProps = {
  onFilesChange: (files: File[]) => void;
  files: File[];
  disabled?: boolean;
};

export default function FileUpload({ onFilesChange, files, disabled }: FileUploadProps) {
  return (
    <div>
      <label className={`block rounded-lg border border-dashed border-white/30 p-6 text-center ${disabled ? "opacity-60" : "cursor-pointer"}`}>
        <input
          type="file"
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            onFilesChange([...files, ...selected]);
            event.currentTarget.value = "";
          }}
        />
        <p className="text-sm text-white/70">Select files to upload</p>
      </label>

      {files.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-white/65">
          {files.map((name) => (
            <li key={`${name.name}-${name.size}`}>{name.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
