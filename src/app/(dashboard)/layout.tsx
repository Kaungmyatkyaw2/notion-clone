import Guard from "@/components/auth/guard";
import SearchCommand from "@/components/common/search-command";
import Sidebar from "@/components/dashboard/sidebar";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Guard>
      <div className="h-screen flex dark:bg-[#1F1F1F]">
        <Sidebar />

        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
    </Guard>
  );
};

export default MainLayout;
