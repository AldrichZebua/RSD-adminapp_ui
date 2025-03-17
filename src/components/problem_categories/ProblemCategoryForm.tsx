"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { useRouter } from "next/navigation";
import { createProblemCategory } from "@/app/(core)/problem_categories/action";

const problemcatogrySchema = z.object({
  name: z.string().min(2).max(50),
  status_label: z.string(),
});

export default function ProblemCategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof problemcatogrySchema>>({
    resolver: zodResolver(problemcatogrySchema),
    defaultValues: {
      name: "",
      status_label: "",
    },
  });

  const onSubmit = async (params: z.infer<typeof problemcatogrySchema>) => {
    setLoading(true);
    try {
      const result = await createProblemCategory(params);
      if (result.success) {
        alert("Berhasil Menambahkan Data");
        router.push(`/problem_categories/${result.data.problem_category.id}`);
      } else {
        alert(`Oopps! Gagal Menambahkan: ${result.data?.message || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl font-medium">Create Problem Category</div>
      <div className="flex flex-col mt-8">
        <div className="mb-5">Silahkan lengkapi data di bawah untuk menambahkan Problem Category</div>

        <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
          <div className="flex flex-col gap-4">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="POST"
            >
              <TextField
                {...form.register("name")}
                label="name"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message}
              />

              <TextField
                {...form.register("status_label")}
                label="status_label"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.status_label}
                helperText={form.formState.errors.status_label?.message}
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
