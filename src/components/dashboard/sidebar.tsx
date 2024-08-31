"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useParams, usePathname, useRouter } from "next/navigation";
import UserItem from "./user-item";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import SidebarItem from "./sidebar-item";
import { toast } from "sonner";
import DocumentList from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/useSearch";
import { useSetting } from "@/hooks/useSetting";
import DocumentNavbar from "./document-navbar";

const Sidebar = () => {
  const onSearchOpen = useSearch((store) => store.onOpen);
  const onSettingOpen = useSetting((store) => store.onOpen);

  const pathname = usePathname();
  const params = useParams();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const navRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const create = useMutation(api.documents.create);

  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile, pathname]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sideBarRef.current && navRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      navRef.current.style.setProperty("left", `${newWidth}px`);
      navRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && navRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sideBarRef.current.style.width = isMobile ? "100%" : "240px";
      navRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navRef.current.style.setProperty("left", isMobile ? "0" : "240px");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapse = () => {
    if (sideBarRef.current && navRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sideBarRef.current.style.width = "0";
      navRef.current.style.width = "100%";
      navRef.current.style.left = "0";

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleCreate = async () => {
    const promise = create({ title: "Untitled" }).then((docId) => {
      router.push(`/documents/${docId}`);
    });
    toast.promise(promise, {
      loading: "Creating a document!",
      success: "Successfully created a document!",
      error: "Failed to create a document!",
    });
  };

  return (
    <>
      <aside
        ref={sideBarRef}
        className={cn(
          "group/sidebar w-60 h-full bg-secondary z-[9999] relative overflow-y-auto overflow-x-hidden",
          isCollapsed && "w-0",
          isResetting && "transition-all duration-200"
        )}
      >
        <div
          onClick={collapse}
          className={cn(
            "rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-4 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="size-6 text-muted-foreground" />
        </div>

        <div>
          <UserItem />
          <SidebarItem
            icon={Search}
            label="Search"
            onClick={onSearchOpen}
            isSearch
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            onClick={onSettingOpen}
          />
          <SidebarItem
            icon={PlusCircle}
            label="New Document"
            onClick={handleCreate}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <SidebarItem icon={Plus} label="Add a page" onClick={handleCreate} />
          <Popover>
            <PopoverTrigger className="w-full mt-3">
              <SidebarItem icon={Trash} label="Trash" />
            </PopoverTrigger>
            <PopoverContent
              className="z-[99999]"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="w-2 absolute right-0 top-0 h-full opacity-0 group-hover/sidebar:opacity-100 bg-primary/10 cursor-ew-resize duration-100"
        />
      </aside>
      <div
        ref={navRef}
        className={cn(
          "absolute top-0 left-60 z-[999] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-200",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <DocumentNavbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="w-full p-3">
            {isCollapsed && (
              <MenuIcon
                role="button"
                className="size-6 text-muted-foreground cursor-pointer"
                onClick={resetWidth}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;
