import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { Link } from "@mui/material";
import NextLink from "next/link";
import { checkPermission } from "../action";
import AdministratorForm from "@/components/administrator/AdministratorForm";

export default async function AdministratorNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
        {permission.administrator_create ? (
          <main>
            <div className="text-3xl font-medium">Tambah Administrator</div>
            <div className="mb-5">
              Silahkan lengkapi data di bawah untuk menambahkan Administrator baru
            </div>
            <AdministratorForm />
          </main>
        ) : (
          <Link
            component={NextLink}
            href={`/administrators`}
            underline="none"
            color="dark"
          />
        )}
      </AdministratorIndexProvider>
    </>
  );
}