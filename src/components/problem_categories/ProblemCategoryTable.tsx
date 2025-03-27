"use client";

import { useProblemCategoryIndexContext } from "./ProblemCategoryIndexProvider";
import { ProblemCategoryIndexResponse } from "../../../types/responses/problem_category";
import {
  destroyProblemCategory,
  getIndexProblemCategory,
} from "@/app/(core)/problem_categories/action";
import useSWR from "swr";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import NextLink from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import qs from "qs";
import { useState } from "react";

export const ProblemCategoryTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { permission } = useProblemCategoryIndexContext();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
  const fetcher = async (): Promise<ProblemCategoryIndexResponse> => {
    const result = await getIndexProblemCategory(searchParams.toString());
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } =
    useSWR<ProblemCategoryIndexResponse>(
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
      const result = await destroyProblemCategory(selectedId);
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
    router.replace(`/problem_categories?${qs.stringify(newParams)}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams = {
      ...currentParams,
      pagination: { pageSize: parseInt(event.target.value, 10), Page: 1 },
    };
    router.replace(`/problem_categories?${qs.stringify(newParams)}`);
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
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((problem_category, index) => (
              <TableRow key={problem_category.id}>
                <TableCell
                  align="center"
                  sx={{ borderRight: 1, borderColor: "grey.300" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    {permission.problem_category_show ? (
                      <Link
                        component={NextLink}
                        href={`/problem_categories/${problem_category.id}`}
                        underline="none"
                        color="dark"
                      >
                        {problem_category.name}
                      </Link>
                    ) : (
                      problem_category.name
                    )}
                    <div className="flex gap-2">
                      {permission.problem_category_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(problem_category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.problem_category_update && (
                        <Tooltip title="Edit Problem Categories">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/problem_categories/${problem_category.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  {problem_category.created_at}
                </TableCell>
                <TableCell align="center">
                  {problem_category.updated_at}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      color:
                        problem_category.status_label === "ACTIVE"
                          ? "green"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {problem_category.status_label}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
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
            Apakah Anda yakin ingin menghapus Problem Category ini? Tindakan ini
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
