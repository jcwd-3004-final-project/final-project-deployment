import Swal from "sweetalert2";

// Fungsi untuk memvalidasi file gambar
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  return allowedTypes.includes(file.type);
};

// Fungsi untuk menampilkan konfirmasi perubahan gambar
export const confirmImageChange = async (
  imageURL: string
): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Confirm Image Change",
    text: "Do you want to use this image as your profile picture?",
    imageUrl: imageURL,
    imageAlt: "New Profile Picture",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
  return result.isConfirmed;
};
