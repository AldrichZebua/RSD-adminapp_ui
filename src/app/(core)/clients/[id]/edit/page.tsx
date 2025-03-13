"use server";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClient } from "../../action";
import ClientFormEdit from "@/components/clients/ClientFormEdit";
import { ClientEntity } from "../../../../../../types/entities/client";

export default function ClientEditPage() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientEntity | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      try {
        const response = await getClient(id);
        if (response.success) {
          setClient(response.data.client);
        } else {
          throw new Error(response.data.message || "Gagal mengambil data Client");
        }
      } catch (error) {
        console.error("Error fetching Client:", error);
        setError("Terjadi kesalahan saat mengambil data Client.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Client</h1>
      {client ? (
        <ClientFormEdit client={client} />
      ) : (
        <div className="text-red-500">Data client tidak ditemukan.</div>
      )}
    </div>
  );
}
