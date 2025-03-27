"use client";

import { startTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";

import { RoleEntity } from "../../../types/entities/roles";
import { AdministratorEntity } from "../../../types/entities/administrators";
import {
  createAdministrator,
  updateAdministrator,
} from "@/app/(core)/administrators/action";
import { useRouter } from "@bprogress/next/app";

type AdministratorFormProps = {
  administrator?: AdministratorEntity;
  roles: Pick<RoleEntity, "id" | "name">[];
};

export default function AdministratorForm({
  administrator,
  roles,
}: AdministratorFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const administratorSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.optional(z.string()),
    password_confirmation: z.optional(z.string()),
    role_ids: z.array(z.string()).nonempty("Role harus dipilih"),
  });

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

  const onSubmit = async (params: z.infer<typeof administratorSchema>) => {
    console.log(params);
    setLoading(true);
    startTransition(async () => {
      const result = administrator
        ? await updateAdministrator(administrator.id, params)
        : await createAdministrator(params);
      if (result.success) {
        router.push(`/administrators/${result.data.administrator.id}`);
      } else {
        alert("Terjadi kesalahan dalam memproses data.");
      }
      setLoading(false);
    });
  };

  return (
    <>
        <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
          <div className="flex flex-col gap-5">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="POST"
            >
              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Username </span>
                </div>
                :
                <TextField
                  {...form.register("username")}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  error={!!form.formState.errors.username}
                  helperText={form.formState.errors.username?.message}
                  disabled={!!administrator}
                  defaultValue={administrator?.username}
                />
              </div>

              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Email</span>
                </div>
                :
                <TextField
                  {...form.register("email")}
                  label="Input Email"
                  variant="outlined"
                  fullWidth
                  error={!!form.formState.errors.email}
                  helperText={form.formState.errors.email?.message}
                />
              </div>

              {!administrator && (
                <>
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-52 text-left">
                      <span>Password</span>
                    </div>
                    :{" "}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Input Password</InputLabel>
                      <OutlinedInput
                        {...form.register("password")}
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        error={!!form.formState.errors.password}
                      />
                    </FormControl>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <div className="w-52 text-left">
                      <span>Confirm Password</span>
                    </div>
                    :{" "}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Input Password Again</InputLabel>
                      <OutlinedInput
                        {...form.register("password_confirmation")}
                        type={showPasswordConfirmation ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswordConfirmation(
                                  !showPasswordConfirmation
                                )
                              }
                              edge="end"
                            >
                              {showPasswordConfirmation ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Confirm Password"
                        error={!!form.formState.errors.password_confirmation}
                      />
                    </FormControl>
                  </div>
                </>
              )}

              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Role</span>
                </div>
                :{" "}
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
              </div>

              <div className="flex justify-end mt-5">
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ControlPointDuplicateIcon />}
                  disabled={loading}
                >
                  {administrator ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </Box>
    </>
  );
}
