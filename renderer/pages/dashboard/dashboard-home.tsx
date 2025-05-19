import React from "react";
import Layout from "./layout";
import { SectionCards } from "@/components/dashboard/section-cards";
import DataTable from "@/components/dashboard/data-table";

const DashboardhomePage = () => {
  return (
    <Layout>
     <SectionCards />
    {/* <DataTable /> */}
    </Layout>
  );
};

export default DashboardhomePage;
