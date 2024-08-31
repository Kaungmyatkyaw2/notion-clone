"use client";

import { useSetting } from "@/hooks/useSetting";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import ModeToggler from "../common/mode-toggler";

const SettingModal = () => {
  const setting = useSetting();

  return (
    <Dialog open={setting.isOpen} onOpenChange={setting.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h1 className="text-lg font-medium">My Settings</h1>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Appearance</Label>
            <p className="text-[0.8rem] text-muted-foreground">
              Customize how Kotion looks on your devices
            </p>
          </div>
          <ModeToggler />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingModal;
