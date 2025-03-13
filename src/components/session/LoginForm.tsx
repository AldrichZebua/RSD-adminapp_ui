"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";

const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    AOS.init({duration:1000});
  },[]);

  const onSubmit = async (params: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        username: params.username,
        password: params.password,
      });
      
      if (result?.ok) {
        setSnackbar({ open: true, message: "Berhasil login. Mengalihkan ke dashboard...", severity: "success" });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setSnackbar({ open: true, message: result?.error || "Login gagal.", severity: "error" });
      }
    } catch (error) {
      console.log(error)
      setSnackbar({ open: true, message: "Terjadi kesalahan. Coba lagi nanti.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-32" data-aos="fade-up">
        <Card sx={{ width: 400, padding: 3 }}>
          <CardContent>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Silahkan login untuk melanjutkan
            </Typography>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...form.register("username")}
                error={!!form.formState.errors.username}
                helperText={form.formState.errors.username?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...form.register("password")}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="flex h-full w-full justify-end">
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert>{snackbar.message}</Alert>
        </Snackbar>
      </div>
    </>
  );
};
