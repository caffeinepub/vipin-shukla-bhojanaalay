import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type MenuItem = {
    name : Text;
    description : Text;
    price : Nat;
  };

  module MenuItem {
    public func compare(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  var restaurantName = "Vipin Shukla Bhojanaalay";
  var upiId = "vipinshukla969561@okhdfcbank";
  var phoneNumber = "9695613005";

  let menuItems = Map.empty<Text, MenuItem>();

  public shared ({ caller }) func updateUPIId(newUPIId : Text) : async () {
    upiId := newUPIId;
  };

  public shared ({ caller }) func updatePhoneNumber(newPhoneNumber : Text) : async () {
    phoneNumber := newPhoneNumber;
  };

  public shared ({ caller }) func addMenuItem(name : Text, description : Text, price : Nat) : async () {
    if (menuItems.containsKey(name)) {
      Runtime.trap("Menu item with this name already exists.");
    };
    let newItem : MenuItem = {
      name;
      description;
      price;
    };
    menuItems.add(name, newItem);
  };

  public query ({ caller }) func getRestaurantInfo() : async {
    name : Text;
    upiId : Text;
    phoneNumber : Text;
  } {
    {
      name = restaurantName;
      upiId;
      phoneNumber;
    };
  };

  public query ({ caller }) func getMenu() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };
};
