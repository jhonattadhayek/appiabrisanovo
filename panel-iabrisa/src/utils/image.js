import { toast } from 'react-toastify';

export const convertImage = async params => {
  const { e } = params;

  if (!e.target.files[0]) return true;

  const file = e.target.files[0];
  const fileName = file && file.name;
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  if (ext !== 'jpeg' && ext !== 'png' && ext !== 'jpg') {
    toast.error('Oops! Arquivo inválido');
    return { url: null };
  }

  const imageObject = { url: await imageToBase64(file) };
  return imageObject;
};

export const imageToBase64 = file => {
  const maxSize = 5000 * 1024;
  if (file.size > maxSize) {
    toast.error('Oops! O arquivo é maior que 5MB');
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  }).catch(error => {
    toast.error('Erro ao ler o arquivo: ' + error.message);
    throw error;
  });
};
