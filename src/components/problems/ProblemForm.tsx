import { z } from "zod";
import { ProblemEntity } from "../../../types/entities/problem";
import { ProblemCategoryEntity } from "../../../types/entities/problem_category";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { Box, Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { createProblem, updateProblem } from "@/app/(core)/problems/action";

type ProblemFormProps = {
  problem?: ProblemEntity;
  problem_category?: ProblemCategoryEntity;
};

const problemSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  status_label: z.string().min(2).max(10),
  problem_category: z.array(z.string()).nonempty("Kategori harus dipilih"),
});

export default function ProblemForm({
  problem,
  problem_category,
}: ProblemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof problemSchema>>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem?.title || "",
      description: problem?.description || "",
      problem_category: problem_category?.name || "",
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
    <>
      <div className="text-3xl font-medium">Create Problem</div>
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          Silahkan lengkapi data di bawah untuk menambahkan Problem
        </div>

        <Box sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
          <div className="flex flex-col gap-4">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              method="POST"
            >
              <TextField
                {...form.register("title")}
                label="title"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.title}
                helperText={form.formState.errors.title?.message}
              />

              <TextField
                {...form.register("description")}
                label="description"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.description}
                helperText={form.formState.errors.description?.message}
              />

              <TextField
                {...form.register("status_label")}
                label="status_label"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.status_label}
                helperText={form.formState.errors.status_label?.message}
              />

              <TextField
                {...form.register("problem_category")}
                label="problem_category"
                variant="outlined"
                fullWidth
                error={!!form.formState.errors.problem_category}
                helperText={form.formState.errors.problem_category?.message}
              />

              <div className="flex flex-row items-center gap-2">
                <div className="w-52 text-left">
                  <span>Problem Categories</span>
                </div>
                :{" "}
                <Controller
                  name="problem_category"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Select Problem Category"
                      fullWidth
                      error={!!form.formState.errors.problem_category}
                      helperText={form.formState.errors.problem_category?.message}
                      onChange={(e) => field.onChange([e.target.value])}
                    >
                      {problem_category.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                          {i.name}
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
