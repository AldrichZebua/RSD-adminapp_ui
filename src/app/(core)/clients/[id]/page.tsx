import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { checkPermission, getClient } from "../action";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { ClientIndexProvider } from "@/components/clients/ClientIndexProvider";
import { ClientEntity } from "../../../../../types/entities/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BreadcrumbCustom } from "@/components/reuse_component/Breadcrumb";
import { pagePermissionCheck } from "@/lib/safePageRequest";
import { ClientSections } from "@/components/clients/lib/client_section";

const breadcrumbItems = (data: ClientEntity) => [
  { title: `Clients`, url: "/clients" },
  { title: `Detail - ${data.name}`, url: `/clients/${data.id}` },
];

async function getData(id: string): Promise<ClientEntity | undefined> {
  const result = await getClient(id);
  return result.success ? result.data.client : undefined;
}

export default async function ClientShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pagePermissionCheck<ClientSections>("client_show");
  const data = await getData((await params).id);
  const permission = await checkPermission();

  if (!data) {
    return <h1>Error fetching data...</h1>;
  }

  return (
    <>
      <ClientIndexProvider permission={permission}>
        <div className="flex gap-2 items-center">
          <Link href="/clients">
            <IconButton color="primary" aria-label="kembali">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <BreadcrumbCustom items={breadcrumbItems(data)} />
        </div>
        <div className="w-full p-4 px-6 lg:px-20">
          <Box
            sx={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              boxShadow: 1,
              borderRadius: 1,
              padding: { xs: 2, sm: 3 },
              width: "100%",
              textAlign: "left",
              height: { xs: "auto", sm: "60px" },
              mb: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "25px", md: "30px" },
              }}
              color="text.primary"
            >
              Detail Client
            </Typography>
          </Box>
          {permission.client_update && (
            <Tooltip title="Edit Client">
              <Button
                href={`/clients/${data.id}/edit`}
                color="primary"
                startIcon={<DriveFileRenameOutlineIcon />}
              >
                Edit
              </Button>
            </Tooltip>
          )}
          <Card
            component={Paper}
            sx={{
              width: "100%",
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
              overflowX: "auto",
            }}
          >
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.300",
                        width: "20%",
                        fontWeight: "bold",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>{data.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.300",
                        width: "20%",
                        fontWeight: "bold",
                      }}
                    >
                      Remark
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>{data.remark}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.300",
                        width: "20%",
                        fontWeight: "bold",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>
                      <div className="flex flex-col">
                        {data.emails.map((email, index) => (
                          <span key={index}>{email}</span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.300",
                        width: "20%",
                        fontWeight: "bold",
                      }}
                    >
                      Created at
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>
                      {data.created_at}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "grey.300",
                        width: "20%",
                        fontWeight: "bold",
                      }}
                    >
                      Last update at
                    </TableCell>
                    <TableCell sx={{ width: "70%" }}>
                      {data.updated_at}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ClientIndexProvider>
    </>
  );
}
