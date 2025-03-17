import { ProblemIndexProvider } from "@/components/problems/ProblemIndexProvider";
import { checkPermission } from "../action";
import Link from "@mui/material/Link";

export default async function ProblemNewPage() {
  const permission = await checkPermission();

  return (
    <>
      <ProblemIndexProvider permission={permission}>
        {permission.problem_create ? (
          <main>
            <ProblemForm />
          </main>
        ) : (
          <Link
            component={NextLink}
            href={`/roles`}
            underline="none"
            color="dark"
          />
        )}
      </ProblemIndexProvider>
    </>
  );
}
