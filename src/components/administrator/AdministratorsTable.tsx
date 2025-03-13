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
} from "@mui/material";
import NextLink from "next/link";
import { AdministratorsIndexResponse } from "../../../types/responses/administrators";
import { useState } from "react";
import { useAdministratorIndexContext } from "./AdministratorIndexProvider";
import {
  destroyAdministrator,
  getIndexAdministrators,
} from "@/app/(core)/administrators/action";

export const AdministratorsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { permission } = useAdministratorIndexContext();

  const fetcher = async (): Promise<AdministratorsIndexResponse> => {
    const result = await getIndexAdministrators("");
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } =
    useSWR<AdministratorsIndexResponse>("Administrator", fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    });

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus administrator ini?")) {
      try {
        const result = await destroyAdministrator(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus administrator: " + result.message);
        }
      } catch (error) {
        console.error("Gagal menghapus administrator", error);
      }
    }
  };

  if (isLoading || isValidating || data == undefined) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">No</TableCell>
            <TableCell align="center">Username</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((admin, index) => (
              <TableRow key={admin.id}>
                <TableCell align="center">
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    <div>
                      {permission.administrator_show ? (
                        <Link
                          component={NextLink}
                          href={`/administrators/${admin.id}`}
                          underline="none"
                          color="primary"
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
                          onClick={() => handleDelete(admin.id)}
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
                    ? admin.roles_metadata.map((role) => role.name).join(", ") || "-"
                    : "-"}
                </TableCell>
                <TableCell align="center">{admin.created_at}</TableCell>
                <TableCell align="center">{admin.updated_at}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={data.data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};
