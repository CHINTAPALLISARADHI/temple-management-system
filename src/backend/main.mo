import Text "mo:core/Text";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat32 "mo:core/Nat32";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type User = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    passwordHash : Text;
  };

  module User {
    public func compare(u1 : User, u2 : User) : Order.Order {
      Text.compare(u1.name, u2.name);
    };
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type DarshanBooking = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    date : Time.Time;
    timeSlot : {
      #morning;
      #afternoon;
      #evening;
    };
    numberOfPersons : Nat;
    status : {
      #pending;
      #confirmed;
      #cancelled;
    };
  };

  module DarshanBooking {
    public func compare(b1 : DarshanBooking, b2 : DarshanBooking) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };

    public func containsName(booking : DarshanBooking, name : Text) : Bool {
      booking.name.toLower().contains(#text(name.toLower()));
    };

    public func containsPhone(booking : DarshanBooking, phone : Text) : Bool {
      booking.phone.toLower().contains(#text(phone.toLower()));
    };
  };

  type SevaBooking = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    sevaType : {
      #abhishek;
      #aarti;
      #puja;
      #havan;
      #archana;
    };
    date : Time.Time;
    amount : Float;
    status : {
      #pending;
      #confirmed;
      #cancelled;
    };
  };

  module SevaBooking {
    public func compare(b1 : SevaBooking, b2 : SevaBooking) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };

    public func containsName(booking : SevaBooking, name : Text) : Bool {
      booking.name.toLower().contains(#text(name.toLower()));
    };

    public func containsPhone(booking : SevaBooking, phone : Text) : Bool {
      booking.phone.toLower().contains(#text(phone.toLower()));
    };
  };

  type RoomBooking = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    roomType : {
      #single;
      #double;
      #dormitory;
    };
    checkIn : Time.Time;
    checkOut : Time.Time;
    numberOfPersons : Nat;
    status : {
      #pending;
      #confirmed;
      #cancelled;
    };
  };

  module RoomBooking {
    public func compare(b1 : RoomBooking, b2 : RoomBooking) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };

    public func containsName(booking : RoomBooking, name : Text) : Bool {
      booking.name.toLower().contains(#text(name.toLower()));
    };

    public func containsPhone(booking : RoomBooking, phone : Text) : Bool {
      booking.phone.toLower().contains(#text(phone.toLower()));
    };
  };

  type Donation = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    amount : Float;
    purpose : {
      #general;
      #templeConstruction;
      #annaPrasad;
      #education;
      #cowProtection;
    };
    paymentMode : {
      #cash;
      #online;
    };
    transactionId : ?Text;
    date : Time.Time;
  };

  module Donation {
    public func compare(d1 : Donation, d2 : Donation) : Order.Order {
      Nat.compare(d1.id, d2.id);
    };

    public func containsName(donation : Donation, name : Text) : Bool {
      donation.name.toLower().contains(#text(name.toLower()));
    };

    public func containsPhone(donation : Donation, phone : Text) : Bool {
      donation.phone.toLower().contains(#text(phone.toLower()));
    };
  };

  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextDarshanId = 1;
  var nextSevaId = 1;
  var nextRoomId = 1;
  var nextDonationId = 1;

  let darshanBookings = Map.empty<Nat, DarshanBooking>();
  let sevaBookings = Map.empty<Nat, SevaBooking>();
  let roomBookings = Map.empty<Nat, RoomBooking>();
  let donations = Map.empty<Nat, Donation>();

  let activeDarshanBookings = Set.empty<Nat32>();
  let activeSevaBookings = Set.empty<Nat32>();
  let activeRoomBookings = Set.empty<Nat32>();
  let activeDonations = Set.empty<Nat32>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User management
  public shared ({ caller }) func registerUser(name : Text, email : Text, phone : Text, passwordHash : Text) : async Principal {
    if (users.containsKey(caller)) {
      Runtime.trap("User already exists");
    };
    let newUser : User = {
      id = caller;
      name;
      email;
      phone;
      passwordHash;
    };
    users.add(caller, newUser);
    
    // Also create user profile
    let profile : UserProfile = {
      name;
      email;
      phone;
    };
    userProfiles.add(caller, profile);
    
    caller;
  };

  public query ({ caller }) func getUser(userId : Principal) : async User {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own user data");
    };
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray().sort();
  };

  public shared ({ caller }) func deleteUser(userId : Principal) : async () {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own account");
    };
    if (not users.containsKey(userId)) { Runtime.trap("User not found") };
    users.remove(userId);
    userProfiles.remove(userId);
  };

  // Darshan bookings
  public shared ({ caller }) func createDarshanBooking(booking : DarshanBooking) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };
    let newId = nextDarshanId;
    nextDarshanId += 1;
    let newBooking = { booking with id = newId; userId = caller };
    darshanBookings.add(newId, newBooking);
    activeDarshanBookings.add(newId.toNat32());
    newId;
  };

  public query ({ caller }) func getDarshanBooking(id : Nat) : async DarshanBooking {
    switch (darshanBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (caller != booking.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        booking;
      };
    };
  };

  public query ({ caller }) func getAllActiveDarshanBookings() : async [DarshanBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    let activeIds = activeDarshanBookings.toArray();
    activeIds.map(
      func(id) {
        switch (darshanBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
  };

  public shared ({ caller }) func updateDarshanBookingStatus(id : Nat, status : { #pending; #confirmed; #cancelled }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (darshanBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        darshanBookings.add(id, updatedBooking);
        if (status == #cancelled) {
          activeDarshanBookings.remove(id.toNat32());
        } else {
          activeDarshanBookings.add(id.toNat32());
        };
      };
    };
  };

  public query ({ caller }) func searchDarshanBookings(term : Text) : async [DarshanBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search bookings");
    };
    let lowerTerm = term.toLower();
    let activeIds = activeDarshanBookings.toArray();
    let allBookings = activeIds.map(
      func(id) {
        switch (darshanBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
    allBookings.filter(
      func(booking) {
        DarshanBooking.containsName(booking, lowerTerm) or DarshanBooking.containsPhone(booking, lowerTerm);
      }
    );
  };

  // Seva bookings
  public shared ({ caller }) func createSevaBooking(booking : SevaBooking) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };
    let newId = nextSevaId;
    nextSevaId += 1;
    let newBooking = { booking with id = newId; userId = caller };
    sevaBookings.add(newId, newBooking);
    activeSevaBookings.add(newId.toNat32());
    newId;
  };

  public query ({ caller }) func getSevaBooking(id : Nat) : async SevaBooking {
    switch (sevaBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (caller != booking.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        booking;
      };
    };
  };

  public query ({ caller }) func getAllActiveSevaBookings() : async [SevaBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    let activeIds = activeSevaBookings.toArray();
    activeIds.map(
      func(id) {
        switch (sevaBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
  };

  public shared ({ caller }) func updateSevaBookingStatus(id : Nat, status : { #pending; #confirmed; #cancelled }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (sevaBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        sevaBookings.add(id, updatedBooking);
        if (status == #cancelled) {
          activeSevaBookings.remove(id.toNat32());
        } else {
          activeSevaBookings.add(id.toNat32());
        };
      };
    };
  };

  public query ({ caller }) func searchSevaBookings(term : Text) : async [SevaBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search bookings");
    };
    let lowerTerm = term.toLower();
    let activeIds = activeSevaBookings.toArray();
    let allBookings = activeIds.map(
      func(id) {
        switch (sevaBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
    allBookings.filter(
      func(booking) {
        SevaBooking.containsName(booking, lowerTerm) or SevaBooking.containsPhone(booking, lowerTerm);
      }
    );
  };

  // Room bookings
  public shared ({ caller }) func createRoomBooking(booking : RoomBooking) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };
    let newId = nextRoomId;
    nextRoomId += 1;
    let newBooking = { booking with id = newId; userId = caller };
    roomBookings.add(newId, newBooking);
    activeRoomBookings.add(newId.toNat32());
    newId;
  };

  public query ({ caller }) func getRoomBooking(id : Nat) : async RoomBooking {
    switch (roomBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (caller != booking.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        booking;
      };
    };
  };

  public query ({ caller }) func getAllActiveRoomBookings() : async [RoomBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    let activeIds = activeRoomBookings.toArray();
    activeIds.map(
      func(id) {
        switch (roomBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
  };

  public shared ({ caller }) func updateRoomBookingStatus(id : Nat, status : { #pending; #confirmed; #cancelled }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (roomBookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        roomBookings.add(id, updatedBooking);
        if (status == #cancelled) {
          activeRoomBookings.remove(id.toNat32());
        } else {
          activeRoomBookings.add(id.toNat32());
        };
      };
    };
  };

  public query ({ caller }) func searchRoomBookings(term : Text) : async [RoomBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search bookings");
    };
    let lowerTerm = term.toLower();
    let activeIds = activeRoomBookings.toArray();
    let allBookings = activeIds.map(
      func(id) {
        switch (roomBookings.get(id.toNat())) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) { booking };
        };
      }
    );
    allBookings.filter(
      func(booking) {
        RoomBooking.containsName(booking, lowerTerm) or RoomBooking.containsPhone(booking, lowerTerm);
      }
    );
  };

  // Donations
  public shared ({ caller }) func addDonation(donation : Donation) : async Nat {
    // Anyone including guests can donate
    let newId = nextDonationId;
    nextDonationId += 1;
    let newDonation = { donation with id = newId };
    donations.add(newId, newDonation);
    activeDonations.add(newId.toNat32());
    newId;
  };

  public query ({ caller }) func getDonation(id : Nat) : async Donation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view donations");
    };
    switch (donations.get(id)) {
      case (null) { Runtime.trap("Donation not found") };
      case (?donation) { donation };
    };
  };

  public query ({ caller }) func getAllActiveDonations() : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all donations");
    };
    let activeIds = activeDonations.toArray();
    activeIds.map(
      func(id) {
        switch (donations.get(id.toNat())) {
          case (null) { Runtime.trap("Donation not found") };
          case (?donation) { donation };
        };
      }
    );
  };

  public query ({ caller }) func searchDonations(term : Text) : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search donations");
    };
    let lowerTerm = term.toLower();
    let activeIds = activeDonations.toArray();
    let allDonations = activeIds.map(
      func(id) {
        switch (donations.get(id.toNat())) {
          case (null) { Runtime.trap("Donation not found") };
          case (?donation) { donation };
        };
      }
    );
    allDonations.filter(
      func(donation) {
        Donation.containsName(donation, lowerTerm) or Donation.containsPhone(donation, lowerTerm);
      }
    );
  };
};
