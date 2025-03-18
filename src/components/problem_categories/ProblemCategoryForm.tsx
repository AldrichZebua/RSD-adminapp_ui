"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { useRouter } from "next/navigation";
import {
  createProblemCategory,
  updateProblemCategory,
} from "@/app/(core)/problem_categories/action";
import { ProblemCategoryEntity } from "../../../types/entities/problem_category";

const problemcatogrySchema = z.object({
  name: z.string().min(2).max(50),
  status_label: z.string(),
});

type ProblemCategoryFormProps = {
  problem_category?: ProblemCategoryEntity;
};

export default function ProblemCategoryForm({
  problem_category,
}: ProblemCategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof problemcatogrySchema>>({
    resolver: zodResolver(problemcatogrySchema),
    defaultValues: {
      name: problem_category?.name || "",
      status_label: problem_category?.status_label || "",
    },
  });

  const onSubmit = async (params: z.infer<typeof problemcatogrySchema>) => {
    console.log(params);
    setLoading(true);
    startTransition(async () => {
      const result = problem_category
        ? await updateProblemCategory(problem_category.id, params)
        : await createProblemCategory(params);
      if (result.success) {
        router.push(`/administrators/${result.data.problem_category.id}`);
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
          <div className="flex flex-col gap-4">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="POST"
            >
              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Nama </span>
                </div>
                :{" "}
                <TextField
                  {...form.register("name")}
                  label="name"
                  variant="outlined"
                  fullWidth
                  error={!!form.formState.errors.name}
                  helperText={form.formState.errors.name?.message}
                />
              </div>

              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Status</span>
                </div>
                :
                <FormControl
                  fullWidth
                  error={!!form.formState.errors.status_label}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...form.register("status_label")}
                    defaultValue="INACTIVE"
                  >
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  </Select>
                  {form.formState.errors.status_label && (
                    <FormHelperText>
                      {form.formState.errors.status_label.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>

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
