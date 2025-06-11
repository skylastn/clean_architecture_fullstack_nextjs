// Tambahkan ini di file extension.ts atau yang sesuai
declare global {
    interface Number {
        toRupiah(): string;
    }
}

// Implementasi method toRupiah
if (typeof Number.prototype.toRupiah !== "function") {
    Number.prototype.toRupiah = function (): string {
        return this.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };
}

export {};
