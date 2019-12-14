function registerValidSW (swUrl: string, config?: Config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            const egistration = registration;
            egistration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === "installed") {
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                "New content is available and will be used when all "
                            );

                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            console.log("Content is cached for offline use.");

                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error("Error during service worker registration:", error);
        });
}
function checkValidServiceWorker (swUrl: string, config: Config) {
    fetch(swUrl)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (
                response.status === 404 ||
                (contentType && !contentType.includes("javascript"))
            ) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log(
                "No internet connection found. App is running in offline mode."
            );
        });
}
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
        new RegExp(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        ).test(window.location.hostname)
);

interface Config {
    onSuccess?(registration: ServiceWorkerRegistration): void;
    onUpdate?(registration: ServiceWorkerRegistration): void;
}

export function register (config: Config) {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
        const publicUrl = new URL(
            (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
            window.location.href
        );
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener("load", () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                checkValidServiceWorker(swUrl, config);

                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        "This web app is being served cache-first by a service "
                    );
                });
            } else {
                registerValidSW(swUrl, config);
            }
        });
    }
}

export function unregister () {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}
