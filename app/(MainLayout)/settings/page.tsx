"use client";

import InstallButton from "@/components/InstallButton";
import { SubscribeButton } from "@/components/SubscribeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      {/* Install PWA */}
      <Card>
        <CardHeader>
          <CardTitle>Install Cypher Web App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            You can install this app on your device for faster access and a more
            native experience.
          </p>
          <InstallButton />
        </CardContent>
      </Card>

      <SubscribeButton />
    </div>
  );
};

export default SettingsPage;
