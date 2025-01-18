import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi";
import Swal from "sweetalert2";

// Misal, import useUser dari context
import { useUser } from "@/context/userContext";

const SuperAdminSidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Ambil logout() dari context
  const { logout } = useUser();

  // Fungsi helper untuk menentukan style jika link aktif
  const getLinkClass = (path: string) => {
    return router.pathname === path
      ? "font-semibold underline"
      : "font-normal hover:underline";
  };

  // Handle logout - sama seperti di Navbar
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Panggil fungsi logout() dari context
        logout();
        // Redirect ke halaman utama
        router.push("/");
      }
    });
  };

  return (
    <>
      {/* Tombol Hamburger (untuk mobile) */}
      <div className="md:hidden p-4 bg-gray-800 text-white">
        <button onClick={() => setIsOpen(true)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-30 w-64 h-screen bg-gray-800 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        <div className="p-4 font-bold text-2xl border-b border-gray-700 flex justify-between items-center md:justify-center">
          <span>SuperAdmin</span>
          {/* Tombol Close (hanya di mobile) */}
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link href="/superadmin/userData" passHref>
                <p className={getLinkClass("/superadmin/userData")}>
                  User Data
                </p>
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link href="/superadmin/CRUD" passHref>
                <p className={getLinkClass("/superadmin/CRUD")}>CRUD Product</p>
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link href="/superadmin" passHref>
                <p className={getLinkClass("/superadmin")}>CRUD Store</p>
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link href="/superadmin/category" passHref>
                <p className={getLinkClass("/superadmin/category")}>
                  CRUD Category
                </p>
              </Link>
            </li>

            {/* Tambahkan menu/tombol Logout */}
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={handleLogout}
            >
              <p className="font-normal hover:underline text-red-300">Logout</p>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay ketika sidebar terbuka di layar kecil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SuperAdminSidebar;
