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
  useMediaQuery,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import NextLink from "next/link";
import { RoleIndexResponse } from "../../../types/responses/roles";
import { useRoleIndexContext } from "./RoleIndexProvider";
import { getIndexRole, destroyRole } from "@/app/(core)/roles/action";
import qs from "qs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";

export const RoleTable = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { permission } = useRoleIndexContext();

  const fetcher = async (): Promise<RoleIndexResponse> => {
    const result = await getIndexRole(searchParams.toString());
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } = useSWR<RoleIndexResponse>(
    `Role_${searchParams.toString()}`,
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
      const result = await destroyRole(selectedId);
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
        style={{
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
    router.replace(`/roles?${qs.stringify(newParams)}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams = {
      ...currentParams,
      pagination: { pageSize: parseInt(event.target.value, 10), Page: 1 },
    };
    router.replace(`/roles?${qs.stringify(newParams)}`);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((role, index) => (
              <TableRow key={role.id}>
                <TableCell
                  align="center"
                  sx={{ borderRight: 1, borderColor: "grey.300" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    <div>
                      {permission.role_show ? (
                        <Link
                          component={NextLink}
                          href={`/roles/${role.id}`}
                          underline="none"
                          color="dark"
                        >
                          {role.name}
                        </Link>
                      ) : (
                        role.name
                      )}
                    </div>
                    <div className="flex flex-row">
                      {permission.role_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(role.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.role_update && (
                        <Tooltip title="Edit Client">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/roles/${role.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">{role.description}</TableCell>
                <TableCell align="center">{role.created_at}</TableCell>
                <TableCell align="center">{role.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={data.data?.length || 0}
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
            Apakah Anda yakin ingin menghapus Role ini? Tindakan ini
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
