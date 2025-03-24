"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@bprogress/next/app";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Container,
} from "@mui/material";
import "aos/dist/aos.css";
import LockIcon from "@mui/icons-material/Lock";
import React from "react";

const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (params: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        username: params.username,
        password: params.password,
      });

      if (result?.ok) {
        setSnackbar({
          open: true,
          message: "Berhasil login. Mengalihkan ke dashboard...",
          severity: "success",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setSnackbar({
          open: true,
          message: result?.error || "Login gagal.",
          severity: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Terjadi kesalahan. Coba lagi nanti.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Box
          sx={{
        background: "linear-gradient(to top, #2d4642, #bac8e0)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 3,
              boxShadow: 3,
              width: "400px",
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: "gray", mb: 2 }} />
            <Typography variant="h6" color="black" className="text-center">
              Hallo, Enter your detail to get sign in to your account!
            </Typography>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                type="username"
                {...form.register("username")}
                variant="filled"
                InputProps={{
                  style: { backgroundColor: "white", borderRadius: 5 },
                }}
                error={!!form.formState.errors.username}
                helperText={form.formState.errors.username?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                variant="filled"
                InputProps={{
                  style: { backgroundColor: "white", borderRadius: 5 },
                }}
                {...form.register("password")}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#4a6370",
                  "&:hover": { bgcolor: "#3a525d" },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign in"}
              </Button>
              {/* <Box sx={{ mt: 2, display: "flex", justifyContent: "end", width: "100%" }}>
          <Link href="#" color="white" underline="none">
            Not a member? Sign Up
          </Link>
        </Box> */}
            </form>
          </Container>
        </Box>
      </div>
      <div className="flex h-full w-full justify-end">
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert>{snackbar.message}</Alert>
        </Snackbar>
      </div>
    </>
  );
}
