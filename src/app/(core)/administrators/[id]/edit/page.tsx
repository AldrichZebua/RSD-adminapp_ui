"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdministratorEntity } from "../../../../../../types/entities/administrators";
import { getAdministrator } from "../../action";
import AdministratorFormEdit from "@/components/administrator/AdministratorFormEdit";

export default function AdministratorEditPage() {
  const { id } = useParams();
  const [administrator, setAdministrator] = useState<
    AdministratorEntity | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAdministrator = async () => {
      try {
        const response = await getAdministrator(id);
        if (response.success) {
          setAdministrator(response.data.administrator);
        } else {
          throw new Error(
            response.data.message || "Gagal mengambil data administrator"
          );
        }
      } catch (error) {
        console.error("Error fetching administrator:", error);
        setError("Terjadi kesalahan saat mengambil data administrator.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrator();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Administrator</h1>
      {administrator ? (
        <AdministratorFormEdit administrator={administrator} />
      ) : (
        <div className="text-red-500">Data administrator tidak ditemukan.</div>
      )}
    </div>
  );
}
