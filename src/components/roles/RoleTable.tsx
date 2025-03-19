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
import { useState } from "react";
import { RoleIndexResponse } from "../../../types/responses/roles";
import { useRoleIndexContext } from "./RoleIndexProvider";
import { getIndexRole, destroyRole } from "@/app/(core)/roles/action";


export const RoleTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {permission} = useRoleIndexContext();

  const fetcher = async (): Promise<RoleIndexResponse> => {
    const result = await getIndexRole("");
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } = useSWR<RoleIndexResponse>(
    "Role",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Role ini?")) {
      try {
        const result = await destroyRole(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus Role");
        }
      } catch (error) {
        console.error("Gagal menghapus Role", error);
      }
    }
  };

  if (isLoading || isValidating || data == undefined) {
    return (
      <Container maxWidth="lg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <TableContainer component={Paper} sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role, index) => (
              <TableRow key={role.id}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                  {
                    permission.role_show
                    ?
                    <Link component={NextLink} href={`/roles/${role.id}`} underline="none" color="dark">
                      {role.name}
                    </Link>
                    :
                    role.name
                  }
                  <div className="flex flex-row">
                  {
                    permission.role_destroy
                    &&
                      <IconButton color="error" onClick={() => handleDelete(role.id)}>
                        <DeleteIcon />
                      </IconButton>
                  }
                  {
                    permission.role_update
                    &&
                    <Tooltip title="Edit Client">
                    <IconButton color="info" component={NextLink} href={`/roles/${role.id}/edit`}>
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  }
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
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
  );
};
