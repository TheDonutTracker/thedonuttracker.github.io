/* Shows one short line when a nudge arrives. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
var REST = "https://zquvatrihtctugeqqoju.supabase.co/rest/v1/rpc/dn_push_peek", KEY = "sb_publishable_88Tn8Xn2e_ixTlwZfEGzKg_CDTOkqrD";
/* The push itself is empty. This asks for the one line to show, by this phone's own subscription address; if
   that fails for any reason the plain line is shown instead, so a notification always appears. */
function line() {
  var plain = "Something new is waiting.";
  return self.registration.pushManager.getSubscription().then(function (sub) {
    if (!sub) return plain;
    var ask = fetch(REST, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ ep: sub.endpoint }) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (t) { return typeof t === "string" && t ? t.slice(0, 90) : plain; });
    var slow = new Promise(function (done) { setTimeout(function () { done(plain); }, 4000); });
    return Promise.race([ask, slow]);
  }).catch(function () { return plain; });
}
self.addEventListener("push", function (e) {
  e.waitUntil(line().then(function (body) {
    return self.registration.showNotification("Donuts", { body: body, icon: "icon.png", badge: "icon.png", tag: "donuts", renotify: true });
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ("focus" in list[i]) return list[i].focus();
    return self.clients.openWindow("./");
  }));
});
