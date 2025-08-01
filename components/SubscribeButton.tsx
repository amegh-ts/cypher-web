import { urlBase64ToUint8Array } from "@/utils/urlBase64ToUint8Array";
import { Button } from "./ui/button";

export const SubscribeButton = () => {
  const subscribeUser = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(sub),
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("Subscribed!");
  };

  return (
    <Button type="button" onClick={subscribeUser}>
      Enable Push Notifications
    </Button>
  );
};
