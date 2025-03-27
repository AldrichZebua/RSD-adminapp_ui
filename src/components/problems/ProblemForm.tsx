"use client";

import { z } from "zod";
import { ProblemEntity } from "../../../types/entities/problem";
import { useForm } from "react-hook-form";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { createProblem, updateProblem } from "@/app/(core)/problems/action";
import { useRouter } from "@bprogress/next/app";
import { ProblemCategoryIndexResponse } from "../../../types/responses/problem_category";
import { getIndexProblemCategory } from "@/app/(core)/problem_categories/action";
import useSWR from "swr";

type ProblemFormProps = {
  problem?: ProblemEntity;
};

const problemSchema = z.object({
  title: z
    .string()
    .min(2, "Title minimal 2 karakter")
    .max(100, "Title maksimal 100 karakter"),
  description: z
    .string()
    .min(2, "Deskripsi minimal 2 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
  problem_category_id: z.string().nonempty("Kategori harus dipilih"),
});

export default function ProblemForm({ problem }: ProblemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = useSWR<ProblemCategoryIndexResponse>(
    "problem_categories",
    async () => {
      const result = await getIndexProblemCategory("");
      if (result.success) {
        return result.data;
      }
      throw new Error(result.data?.message || "Failed to fetch data");
    }
  );

  const form = useForm<z.infer<typeof problemSchema>>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem?.title || "",
      description: problem?.description || "",
      problem_category_id: problem?.problem_category?.id || "",
    },
  });

  const onSubmit = async (params: z.infer<typeof problemSchema>) => {
    console.log(params);
    setLoading(true);
    startTransition(async () => {
      const result = problem
        ? await updateProblem(problem.id, params)
        : await createProblem(params);
      if (result.success) {
        router.push(`/problems/${result.data.problem.id}`);
      } else {
        alert("Terjadi kesalahan dalam memproses data.");
      }
      setLoading(false);
    });
  };

  return (
    <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
      <div className="flex flex-col gap-2">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 gap-5"
          method="POST"
        >
          <div className="flex flex-row items-center gap-2">
            <div className="w-52 text-left">
              <span>Title</span>
            </div>
            :
            <TextField
              {...form.register("title")}
              variant="outlined"
              fullWidth
              error={!!form.formState.errors.title}
              helperText={form.formState.errors.title?.message}
              defaultValue={problem?.title}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="w-52 text-left">
              <span>Description</span>
            </div>
            :
            <TextField
              {...form.register("description")}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={!!form.formState.errors.description}
              helperText={form.formState.errors.description?.message}
              defaultValue={problem?.description}
            />
          </div>

          {/* <div className="flex flex-row items-center gap-2">
            <div className="w-52 text-left">
              <span>Status</span>
            </div>
            :
            <FormControl fullWidth error={!!form.formState.errors.status_label}>
              <Select
                {...form.register("status_label")}
                labelId="status-label"
                defaultValue={problem?.status_label || "DRAFT"}
              >
                <MenuItem value="DRAFT">DRAFT</MenuItem>
                <MenuItem value="SUBMITTED">SUBMITTED</MenuItem>
                <MenuItem value="REVISION">REVISION</MenuItem>
                <MenuItem value="PROGRESS">PROGRESS</MenuItem>
              </Select>
              <FormHelperText>
                {form.formState.errors.status_label?.message}
              </FormHelperText>
            </FormControl>
          </div> */}

          <div className="flex flex-row items-center gap-2">
            <div className="w-52 text-left">
              <span>Problem Category</span>
            </div>
            :
            <FormControl
              fullWidth
              error={!!form.formState.errors.problem_category_id}
            >
              <InputLabel id="problem-category-label"></InputLabel>
              <Select
                {...form.register("problem_category_id")}
                labelId="problem-category-label"
                defaultValue={problem?.problem_category?.name || ""}
                disabled={isLoading}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : error ? (
                  <MenuItem disabled>Error loading categories</MenuItem>
                ) : (
                  data?.data.map((problem_category) => (
                    <MenuItem
                      key={problem_category.id}
                      value={problem_category.id}
                    >
                      {problem_category.name}
                    </MenuItem>
                  ))
                )}

                {/* {problem?.problem_category.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {problem.problem_category.name}
                  </MenuItem>
                ))} */}
              </Select>
              <FormHelperText>
                {form.formState.errors.problem_category_id?.message}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="flex justify-end mt-5">
            <Button
              type="submit"
              variant="contained"
              endIcon={<ControlPointDuplicateIcon />}
              disabled={loading}
            >
              {problem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Box>
  );
}
