import { Breadcrumbs, Link, Typography } from "@mui/material";

type BreadcrumbItem = {
  title: string;
  url?: string;
};

type BreadcrumbCustomProps = {
  items: BreadcrumbItem[];
};

export const BreadcrumbCustom = ({ items }: BreadcrumbCustomProps) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={index} color="text.primary">
            {item.title}
          </Typography>
        ) : (
          <Link key={index} color="inherit" href={item.url} underline="hover">
            {item.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
