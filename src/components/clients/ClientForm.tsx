"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, IconButton } from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { ClientEntity } from "../../../types/entities/client";
import { createClient, updateClient } from "@/app/(core)/clients/action";
import { useRouter } from "@bprogress/next/app";

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
    setValue(
      "emails",
      emails.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (params: z.infer<typeof clientSchema>) => {
    console.log(params);
    setLoading(true);
    startTransition(async () => {
      const result = client
        ? await updateClient(client.id, params)
        : await createClient(params);
      if (result.success) {
        router.push(`/clients/${result.data.client.id}`);
      } else {
        alert("Terjadi kesalahan dalam memproses data.");
      }
      setLoading(false);
    });
  };

  return (
    <>
      <div className="flex flex-col mt-8">
        <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            method="POST"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Client Name </span>
                </div>
                <div className="flex items-center">:</div>
                <TextField
                  {...register("name")}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  error={!!formState.errors.name}
                  helperText={formState.errors.name?.message}
                  defaultValue={client?.name}
                />
              </div>

              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Remark</span>
                </div>
                <div className="flex items-center">:</div>
                <TextField
                  {...register("remark")}
                  label="Remark"
                  variant="outlined"
                  fullWidth
                  error={!!formState.errors.remark}
                  helperText={formState.errors.remark?.message}
                  defaultValue={client?.remark}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-52 text-left">
                  <span className="">Email</span>
                </div>
                <div className="flex items-center">:</div>
                <div className="flex flex-col w-full gap-2">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <TextField
                        {...register(`emails.${index}` as const)}
                        label={`Email ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        error={!!formState.errors.emails?.[index]}
                        helperText={formState.errors.emails?.[index]?.message}
                        defaultValue={client?.emails?.[index] ?? ""}
                      />
                      {emails.length > 1 && (
                        <IconButton onClick={() => removeEmailField(index)}>
                          <RemoveCircleOutlineIcon color="error" />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={addEmailField} variant="outlined">
              Tambah Email
            </Button>

            <div className="flex justify-end mt-5">
              <Button
                type="submit"
                variant="contained"
                endIcon={<ControlPointDuplicateIcon />}
                disabled={loading}
              >
                {client ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </>
  );
}
