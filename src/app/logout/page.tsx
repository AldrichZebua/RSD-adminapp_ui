"use client";

import { useRouter } from "@bprogress/next/app";
import { signOut } from "next-auth/react";

import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    signOut({
      redirect: false,
    }).then(() => {
      router.replace(`/login`);
    });
  });

  return (
    <h1 className="font-medium">
      Mohon tunggu, sistem akan mengakhiri sesi Anda.
    </h1>
  );
};

export default LogoutPage;
