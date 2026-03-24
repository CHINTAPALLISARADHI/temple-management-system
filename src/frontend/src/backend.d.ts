import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Donation {
    id: bigint;
    date: Time;
    name: string;
    email: string;
    paymentMode: Variant_cash_online;
    phone: string;
    amount: number;
    purpose: Variant_education_templeConstruction_annaPrasad_general_cowProtection;
    transactionId?: string;
}
export type Time = bigint;
export interface RoomBooking {
    id: bigint;
    status: Variant_cancelled_pending_confirmed;
    checkIn: Time;
    userId: Principal;
    name: string;
    numberOfPersons: bigint;
    checkOut: Time;
    phone: string;
    roomType: Variant_dormitory_double_single;
}
export interface User {
    id: Principal;
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
}
export interface DarshanBooking {
    id: bigint;
    status: Variant_cancelled_pending_confirmed;
    userId: Principal;
    date: Time;
    name: string;
    numberOfPersons: bigint;
    phone: string;
    timeSlot: Variant_morning_evening_afternoon;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface SevaBooking {
    id: bigint;
    status: Variant_cancelled_pending_confirmed;
    userId: Principal;
    date: Time;
    name: string;
    sevaType: Variant_aarti_havan_puja_archana_abhishek;
    phone: string;
    amount: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_aarti_havan_puja_archana_abhishek {
    aarti = "aarti",
    havan = "havan",
    puja = "puja",
    archana = "archana",
    abhishek = "abhishek"
}
export enum Variant_cancelled_pending_confirmed {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum Variant_cash_online {
    cash = "cash",
    online = "online"
}
export enum Variant_dormitory_double_single {
    dormitory = "dormitory",
    double_ = "double",
    single = "single"
}
export enum Variant_education_templeConstruction_annaPrasad_general_cowProtection {
    education = "education",
    templeConstruction = "templeConstruction",
    annaPrasad = "annaPrasad",
    general = "general",
    cowProtection = "cowProtection"
}
export enum Variant_morning_evening_afternoon {
    morning = "morning",
    evening = "evening",
    afternoon = "afternoon"
}
export interface backendInterface {
    addDonation(donation: Donation): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDarshanBooking(booking: DarshanBooking): Promise<bigint>;
    createRoomBooking(booking: RoomBooking): Promise<bigint>;
    createSevaBooking(booking: SevaBooking): Promise<bigint>;
    deleteUser(userId: Principal): Promise<void>;
    getAllActiveDarshanBookings(): Promise<Array<DarshanBooking>>;
    getAllActiveDonations(): Promise<Array<Donation>>;
    getAllActiveRoomBookings(): Promise<Array<RoomBooking>>;
    getAllActiveSevaBookings(): Promise<Array<SevaBooking>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDarshanBooking(id: bigint): Promise<DarshanBooking>;
    getDonation(id: bigint): Promise<Donation>;
    getRoomBooking(id: bigint): Promise<RoomBooking>;
    getSevaBooking(id: bigint): Promise<SevaBooking>;
    getUser(userId: Principal): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, email: string, phone: string, passwordHash: string): Promise<Principal>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchDarshanBookings(term: string): Promise<Array<DarshanBooking>>;
    searchDonations(term: string): Promise<Array<Donation>>;
    searchRoomBookings(term: string): Promise<Array<RoomBooking>>;
    searchSevaBookings(term: string): Promise<Array<SevaBooking>>;
    updateDarshanBookingStatus(id: bigint, status: Variant_cancelled_pending_confirmed): Promise<void>;
    updateRoomBookingStatus(id: bigint, status: Variant_cancelled_pending_confirmed): Promise<void>;
    updateSevaBookingStatus(id: bigint, status: Variant_cancelled_pending_confirmed): Promise<void>;
}
