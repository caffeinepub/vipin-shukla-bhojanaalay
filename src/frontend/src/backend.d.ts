import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    price: bigint;
}
export interface Review {
    starsCount: bigint;
    customerName: string;
    productName: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    addMenuItem(name: string, description: string, price: bigint): Promise<void>;
    addReview(productName: string, customerName: string, starsCount: bigint, message: string): Promise<void>;
    getMenu(): Promise<Array<MenuItem>>;
    getRestaurantInfo(): Promise<{
        name: string;
        upiId: string;
        phoneNumber: string;
    }>;
    getReviews(): Promise<Array<Review>>;
    updatePhoneNumber(newPhoneNumber: string): Promise<void>;
    updateUPIId(newUPIId: string): Promise<void>;
}
