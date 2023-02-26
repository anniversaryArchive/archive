import heic2any from 'heic2any';

export function convertFile (file: File): Promise<{ file?: Blob | Blob[], path: string }> {
  return new Promise(async (resolve, reject) => {
    const isHeic = file.type.indexOf('heic') > -1;
    if (isHeic) {
      try {
        const blob: Blob | Blob[] = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.94
        });
        const path = URL.createObjectURL(blob as Blob);
        resolve({ file: blob, path });
      } catch (err) { reject(Error(err.toString())); }
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve({ path: e.target.result });
      reader.readAsDataURL(file);
    }
  });
}
