/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "@bprogress/next/app";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { RoleDetailEntity } from "../../../types/entities/roles";
import { createRole, updateRole } from "@/app/(core)/roles/action";

type RoleFormProps = {
  sectionTree: Array<any>;
  role?: RoleDetailEntity;
};

const roleSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(255),
  rule_set: z.array(z.string()),
});

const RoleForm: React.FC<RoleFormProps> = ({ sectionTree, role }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      rule_set: role?.rule_set || [],
    },
  });

  const handleCheckboxChange =
    (field: any, key: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked
        ? [...field.value, key]
        : field.value.filter((value: string) => value !== key);
      field.onChange(newValue);
    };

  const onSubmit = async (params: z.infer<typeof roleSchema>) => {
    console.log(params);
    setLoading(true);
    startTransition(async () => {
      const result = role
        ? await updateRole(role.id, params)
        : await createRole(params);
      if (result.success) {
        router.push(`/roles/${result.data.role.id}`);
      } else {
        alert("Terjadi kesalahan dalam memproses data.");
      }
      setLoading(false);
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Nama Hak Akses"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Deskripsi Singkat"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="rule_set"
            control={form.control}
            render={({ field }) => (
              <FormGroup>
                <Typography variant="subtitle1" gutterBottom>
                  Sections (Pilih menu dan aksi yang diberikan akses)
                </Typography>
                {sectionTree.map((section: any) => (
                  <div key={section.key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes(section.key)}
                          onChange={handleCheckboxChange(field, section.key)}
                        />
                      }
                      label={section.title}
                    />

                    {section.children.map((child: any) => (
                      <div key={child.key} style={{ marginLeft: "20px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value.includes(child.key)}
                              onChange={handleCheckboxChange(field, child.key)}
                            />
                          }
                          label={child.title}
                        />

                        {child.children.map((subchild: any) => (
                          <div
                            key={subchild.key}
                            style={{ marginLeft: "40px" }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value.includes(subchild.key)}
                                  onChange={handleCheckboxChange(
                                    field,
                                    subchild.key
                                  )}
                                />
                              }
                              label={subchild.title}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </FormGroup>
            )}
          />
          <div className="flex w-full justify-end mt-5">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
