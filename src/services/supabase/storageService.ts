import { supabase } from '../supabaseClient';

const OCCURRENCE_PHOTOS_BUCKET = 'occurrence-photos';

export type UploadFolder = 'occurrences' | 'resolutions';

export type UploadedImage = {
  path: string;
  publicUrl: string;
};

function getFileExtension(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'jpg';
  }

  return extension;
}

export async function uploadOccurrenceImage(
  file: File,
  folder: UploadFolder,
): Promise<UploadedImage> {
  const extension = getFileExtension(file);
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(OCCURRENCE_PHOTOS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(OCCURRENCE_PHOTOS_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
