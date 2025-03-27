"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import useSWR from "swr";
import {
  Container,
  Tooltip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Link,
  IconButton,
  TablePagination,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  useMediaQuery,
} from "@mui/material";
import NextLink from "next/link";
import { AdministratorsIndexResponse } from "../../../types/responses/administrators";
import { useAdministratorIndexContext } from "./AdministratorIndexProvider";
import {
  destroyAdministrator,
  getIndexAdministrator,
} from "@/app/(core)/administrators/action";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";

export const AdministratorsTable = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { permission } = useAdministratorIndexContext();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetcher = async (): Promise<AdministratorsIndexResponse> => {
    const result = await getIndexAdministrator(searchParams.toString());
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } =
    useSWR<AdministratorsIndexResponse>(
      `administrators_${searchParams.toString()}`,
      fetcher,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      }
    );

  const handleOpenDialog = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const result = await destroyAdministrator(selectedId);
      if (result.success) {
        mutate();
      } else {
        alert("Gagal menghapus administrator: " + result);
      }
    } catch (error) {
      console.error("Gagal menghapus administrator", error);
    } finally {
      handleCloseDialog();
    }
  };

  if (isLoading || isValidating || data == undefined) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams = {
      ...currentParams,
      pagination: { pageSize: 10, current: newPage + 1 },
    };
    router.replace(`/administrators?${qs.stringify(newParams)}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams = {
      ...currentParams,
      pagination: { pageSize: parseInt(event.target.value, 10), Page: 1 },
    };
    router.replace(`/administrators?${qs.stringify(newParams)}`);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer
        sx={{
          border: 1,
          borderColor: "grey.300",
          borderRadius: 2,
          mt: 1,
          maxWidth: isSmallScreen ? 440 : "100%",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "grey.200",
                borderBottom: 2,
                borderColor: "grey.400",
              }}
            >
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((admin, index) => (
              <TableRow key={admin.id}>
                <TableCell
                  align="center"
                  sx={{ borderRight: 1, borderColor: "grey.300" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    <div>
                      {permission.administrator_show ? (
                        <Link
                          component={NextLink}
                          href={`/administrators/${admin.id}`}
                          underline="none"
                          color="dark"
                        >
                          {admin.username}
                        </Link>
                      ) : (
                        admin.username
                      )}
                    </div>
                    <div className="flex gap-2">
                      {permission.administrator_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(admin.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.administrator_update && (
                        <Tooltip title="Edit Administrator">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/administrators/${admin.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">{admin.email}</TableCell>
                <TableCell align="center">
                  {Array.isArray(admin.roles_metadata)
                    ? admin.roles_metadata
                        .map((role) => role.name)
                        .join(", ") || ""
                    : ""}
                </TableCell>
                <TableCell align="center">{admin.created_at}</TableCell>
                <TableCell align="center">{admin.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={data.total || 0}
          rowsPerPage={parseInt(
            searchParams.get("pagination[pageSize]") ?? "10"
          )}
          page={parseInt(searchParams.get("pagination[current]") ?? "1") - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: "center", color: "red" }}>
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus Administrator ini? Tindakan ini
            tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Batal
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
