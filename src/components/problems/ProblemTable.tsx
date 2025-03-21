"use client";

import { useProblemIndexContext } from "./ProblemIndexProvider";
import { ProblemIndexResponse } from "../../../types/responses/problem";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import useSWR from "swr";
import {
  CircularProgress,
  Container,
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
} from "@mui/material";
import NextLink from "next/link";
import { getIndexProblem, destroyProblem } from "@/app/(core)/problems/action";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import qs from "qs";

export const ProblemTable = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
  const { permission } = useProblemIndexContext();

  const fetcher = async (): Promise<ProblemIndexResponse> => {
    const result = await getIndexProblem(searchParams.toString());
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.data.message);
    }
  };

  const { data, isLoading, isValidating, mutate } =
    useSWR<ProblemIndexResponse>(
      `administrators_${searchParams.toString()}`,
      fetcher,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      }
    );

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Problem ini?")) {
      try {
        const result = await destroyProblem(id);
        if (result.success) {
          mutate();
        } else {
          alert("Gagal menghapus Problem" + result);
        }
      } catch (error) {
        console.error("Gagal menghapus Problem", error);
      }
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
    router.replace(`/problems?${qs.stringify(newParams)}`);
  };


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentParams = qs.parse(searchParams.toString());
    const newParams ={
      ...currentParams,
      pagination: {pageSize: parseInt(event.target.value, 10), Page : 1},
    };
    router.replace(`/problems?${qs.stringify(newParams)}`)
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: "100%", mt: 4, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Problem Category</TableCell>
              <TableCell align="center">Create At</TableCell>
              <TableCell align="center">Update At</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((problem, index) => (
              <TableRow key={problem.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-between items-center">
                    <div>
                      {permission.problem_show ? (
                        <Link
                          component={NextLink}
                          href={`/problems/${problem.id}`}
                          underline="none"
                          color="dark"
                        >
                          {problem.title}
                        </Link>
                      ) : (
                        problem.title
                      )}
                    </div>
                    <div className="flex flex-row">
                      {permission.problem_destroy && (
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(problem.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {permission.problem_update && (
                        <Tooltip title="Edit Administrator">
                          <IconButton
                            color="info"
                            component={NextLink}
                            href={`/problems/${problem.id}/edit`}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  {problem.problem_category?.name}
                </TableCell>
                <TableCell align="center">{problem.created_at}</TableCell>
                <TableCell align="center">{problem.updated_at}</TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      color: (() => {
                        switch (problem.status_label) {
                          case "DRAFT":
                            return "red";
                          case "SUBMITTED":
                          case "REVISION":
                            return "orange";
                          case "PROGRESS":
                            return "blue";
                          case "DONE":
                            return "green";
                          default:
                            return "gray";
                        }
                      })(),
                      fontWeight: "bold",
                    }}
                  >
                    {problem.status_label}
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
          rowsPerPage={parseInt(searchParams.get("pagination[pageSize]") ?? "10")}
          page={parseInt(searchParams.get("pagination[current]") ?? "1") - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};
