/* Shows a plain line when a nudge arrives. Nothing about what happened is sent or stored here. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  e.waitUntil(self.registration.showNotification("Donuts", { body: "Something new is waiting.", icon: "icon.png", badge: "icon.png", tag: "donuts", renotify: true }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ("focus" in list[i]) return list[i].focus();
    return self.clients.openWindow("./");
  }));
});
