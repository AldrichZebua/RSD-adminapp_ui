"use client";

import { useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, IconButton } from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useRouter } from "next/navigation";
import { ClientEntity } from "../../../types/entities/client";
import { createClient, updateClient } from "@/app/(core)/clients/action";

const clientSchema = z.object({
  name: z.string().min(2).max(50),
  remark: z.string().min(2).max(50),
  emails: z.array(z.string().email()).min(1, "Minimal satu email harus diisi"),
});

type ClientFormProps = {
  client?: ClientEntity;
};

export default function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || "",
      remark: client?.remark || "",
      emails: client?.emails || [""],
    },
  });

  const { register, handleSubmit, formState, setValue, watch } = form;
  const emails = watch("emails");

  const addEmailField = () => {
    setValue("emails", [...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    setValue("emails", emails.filter((_, i) => i !== index));
  };

  const onSubmit = async (params: z.infer<typeof clientSchema>) => {
    setLoading(true);
    try {
      const result = client ? await updateClient(client.id, params) : await createClient(params);
      if (result.success) {
        alert(client ? "Berhasil Mengupdate Data" : "Berhasil Menyimpan Data");
        router.push(`/dashboard/clients/${result.data.client.id}`);
      } else {
        alert(`Oopps! Gagal ${client ? "Mengupdate" : "Menyimpan"}: ${result.data?.message || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan dalam menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl font-medium">{client ? "Edit Client" : "Tambah Client"}</div>
      <div className="flex flex-col mt-8">
        <div className="mb-5">Silahkan lengkapi data di bawah untuk {client ? "mengedit" : "menambahkan"} Client</div>

        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="POST">
            <TextField
              {...register("name")}
              label="Name"
              variant="outlined"
              fullWidth
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message}
            />

            <TextField
              {...register("remark")}
              label="Remark"
              variant="outlined"
              fullWidth
              error={!!formState.errors.remark}
              helperText={formState.errors.remark?.message}
            />

            {emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <TextField
                  {...register(`emails.${index}` as const)}
                  label={`Email ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  error={!!formState.errors.emails?.[index]}
                  helperText={formState.errors.emails?.[index]?.message}
                />
                {emails.length > 1 && (
                  <IconButton onClick={() => removeEmailField(index)}>
                    <RemoveCircleOutlineIcon color="error" />
                  </IconButton>
                )}
              </div>
            ))}
            <Button onClick={addEmailField} variant="outlined">
              Tambah Email
            </Button>

            <div className="flex justify-end mt-5">
              <Button type="submit" variant="contained" endIcon={<ControlPointDuplicateIcon />} disabled={loading}>
                {client ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </>
  );
}
