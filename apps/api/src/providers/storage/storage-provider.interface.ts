export interface UploadFileInput {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface UploadFileResult {
  url: string;
  key: string;
}

export interface StorageProvider {
  upload(file: UploadFileInput, folder: string): Promise<UploadFileResult>;
  delete(key: string): Promise<void>;
}
