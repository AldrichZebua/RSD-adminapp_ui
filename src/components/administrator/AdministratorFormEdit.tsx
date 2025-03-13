"use client";

import { useState, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,

  MenuItem,
  TextField,
} from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { Role } from "../../../types/entities/roles";
import { AdministratorEntity } from "../../../types/entities/administrators";
import { useRouter } from "next/navigation";
import { createAdministrator, getRoleDropdown, updateAdministrator } from "@/app/(core)/administrators/action";

const administratorSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(5).max(255),
    password_confirmation: z.string().min(5).max(255),
    role_ids: z.array(z.string()).nonempty("Role harus dipilih"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation must match password",
    path: ["password_confirmation"],
  });

type AdministratorFormProps = {
  administrator?: AdministratorEntity;
};

export default function AdministratorFormEdit({
  administrator,
}: AdministratorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const form = useForm<z.infer<typeof administratorSchema>>({
    resolver: zodResolver(administratorSchema),
    defaultValues: {
      username: administrator?.username || "",
      email: administrator?.email || "",
      password: "",
      password_confirmation: "",
      role_ids: administrator?.role_ids || [],
    },
  });

  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoleDropdown();
      if (response.success) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const onSubmit = async (params: z.infer<typeof administratorSchema>) => {
    setLoading(true);
    try {
      let result;
      if (!administrator) {
        result = await createAdministrator(params);
      } else {
        result = await updateAdministrator(administrator.id, params);
      }

      if (result.success) {
        alert(
          administrator ? "Berhasil Mengupdate Data" : "Berhasil Menyimpan Data"
        );
        router.push(
          `/dashboard/administrators/${result.data.administrator.id}`
        );
      } else {
        alert(`Oops! Gagal: ${result.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl font-medium">
        {administrator ? "Edit Administrator" : "Tambah Administrator"}
      </div>
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          Silahkan lengkapi data di bawah untuk{" "}
          {administrator ? "memperbarui" : "menambahkan"} Administrator
        </div>

        <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
          <div className="flex flex-col gap-4">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="POST"
            >
              <TextField
                {...form.register("username")}
                label="Username"
                variant="outlined"
                disabled
                fullWidth
                error={!!form.formState.errors.username}
                helperText={form.formState.errors.username?.message}
              />

              <TextField
                {...form.register("email")}
                label="Email"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email?.message}
              />
              
              <Controller
                name="role_ids"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Select Role"
                    fullWidth
                    error={!!form.formState.errors.role_ids}
                    helperText={form.formState.errors.role_ids?.message}
                    onChange={(e) => field.onChange([e.target.value])}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <div className="flex justify-end mt-5">
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ControlPointDuplicateIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : administrator ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </div>
    </>
  );
}
