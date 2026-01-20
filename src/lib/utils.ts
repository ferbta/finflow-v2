
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

const chuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function docBlockBaSo(n: number) {
    let res = "";
    const tram = Math.floor(n / 100);
    const chuc = Math.floor((n % 100) / 10);
    const donVi = n % 10;

    if (tram === 0 && chuc === 0 && donVi === 0) return "";

    if (tram !== 0) {
        res += chuSo[tram] + " trăm ";
        if (chuc === 0 && donVi !== 0) res += "lẻ ";
    } else if (res !== "") {
        res += "không trăm ";
        if (chuc === 0 && donVi !== 0) res += "lẻ ";
    }

    if (chuc !== 0 && chuc !== 1) {
        res += chuSo[chuc] + " mươi ";
        if (chuc === 0 && donVi !== 0) res = res.trim() + " lẻ ";
    } else if (chuc === 1) {
        res += "mười ";
    }

    if (donVi !== 0) {
        if (donVi === 1 && chuc > 1) res += "mốt";
        else if (donVi === 5 && chuc > 0) res += "lăm";
        else res += chuSo[donVi];
    }

    return res.trim();
}

export function numberToVietnameseWords(n: number): string {
    if (n === 0) return "Không đồng";
    if (n < 0) return "Âm " + numberToVietnameseWords(Math.abs(n)).toLowerCase();

    let res = "";
    let units = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
    let i = 0;

    while (n > 0) {
        let block = n % 1000;
        let s = docBlockBaSo(block);
        if (s !== "") {
            res = s + units[i] + (res !== "" ? " " + res : "");
        }
        n = Math.floor(n / 1000);
        i++;
    }

    res = res.trim();
    return res.charAt(0).toUpperCase() + res.slice(1) + " đồng";
}
