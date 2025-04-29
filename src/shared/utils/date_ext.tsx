declare global {
    interface Date {
        toIDDate(): string;
    }
}

if (typeof Date.prototype.toIDDate !== "function") {
    Date.prototype.toIDDate = function (): string {
        return this.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
}


export {}; // supaya file dianggap module
