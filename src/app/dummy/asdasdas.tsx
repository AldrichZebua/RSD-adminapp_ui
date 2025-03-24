"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { checkPermission, destroyAdministrator, getAdministrator } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { AdministratorsShowResponse } from "../../../../../types/responses/administrators";
import { AdministratorIndexProvider } from "@/components/administrator/AdministratorIndexProvider";
import { Role } from "../../../../../types/entities/roles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { AdministratorEntity } from "../../../../../types/entities/administrators";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { AdministratorSections } from "@/components/administrator/lib/administrators_section";
import { useRouter } from "next/navigation";

const breadcrumbItems = (data: AdministratorEntity) => [
  { title: `Administrators`, url: "/administrators" },
  { title: `Detail - ${data.username}`, url: `/administrators/${data.id}` },
];

async function getData(
  id: string
): Promise<AdministratorsShowResponse | undefined> {
  const result = await getAdministrator(id);
  return result.success ? result.data : undefined;
}

export const AdministratorShowPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await pagePermissionCheck<AdministratorSections>("administrator_show");
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus administrator ini?")) {
      try {
        const result = await destroyAdministrator(id);
        if (result.success) {
          router.push(`/administrators`);
        } else {
          alert("Gagal menghapus administrator: " + result);
        }
      } catch (error) {
        console.error("Gagal menghapus administrator", error);
      }
    }
  };
  

  return (
    <>
      <AdministratorIndexProvider permission={permission}>
        <div className="flex gap-2 items-center mb-2">
          <Link href="/administrators">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data.administrator)} />
        </div>
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: 1,
            borderRadius: 1,
            padding: 3,
            width: "100%",
            textAlign: "left",
            paddingX: 3,
            paddingY: 1,
            height: "60px",
            mb: 3,
          }}
        >
          <Typography
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            color="text.primary"
          >
            Administrator
          </Typography>
        </Box>

        {permission.administrator_create && (
          <Tooltip title="Edit Administrator">
            <Button
              href={`/administrators/${data.administrator.id}/edit`}
              startIcon={<DriveFileRenameOutlineIcon />}
            >
              edit
            </Button>
          </Tooltip>
        )}
        {permission.administrator_create && (
          <Tooltip title="Delete Administrator">
            <Button
            color="error"
            onClick={() => handleDelete(data.administrator.id)}              
            startIcon={<DriveFileRenameOutlineIcon />}
            >
              edit
            </Button>
          </Tooltip>
        )}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-40">
                    Administrator
                  </TableCell>
                  <TableCell>: {data.administrator.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Email</TableCell>
                  <TableCell>: {data.administrator.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Created at</TableCell>
                  <TableCell>: {data.administrator.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">
                    Last update at
                  </TableCell>
                  <TableCell>: {data.administrator.updated_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium w-40">Hak Akses</TableCell>
                  <TableCell>
                    {data.roles.map((role: Role) => (
                      <div key={role.id} className="block">
                        : {role.name}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AdministratorIndexProvider>
    </>
  );
};