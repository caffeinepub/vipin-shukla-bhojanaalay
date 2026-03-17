import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import List "mo:core/List";
import Migration "migration";

(with migration = Migration.run)
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

  type Review = {
    productName : Text;
    customerName : Text;
    starsCount : Nat;
    message : Text;
    timestamp : Int;
  };

  module Review {
    public func compareTimestampDescending(r1 : Review, r2 : Review) : Order.Order {
      Int.compare(r2.timestamp, r1.timestamp);
    };
  };

  var restaurantName = "Vipin Shukla Bhojanaalay";
  var upiId = "vipinshukla969561@okhdfcbank";
  var phoneNumber = "9695613005";

  let menuItems = Map.empty<Text, MenuItem>();
  let reviews = List.empty<Review>();

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

  public shared ({ caller }) func addReview(productName : Text, customerName : Text, starsCount : Nat, message : Text) : async () {
    if (starsCount < 1 or starsCount > 5) {
      Runtime.trap("Star rating must be between 1 and 5");
    };

    let newReview : Review = {
      productName;
      customerName;
      starsCount;
      message;
      timestamp = Time.now();
    };

    reviews.add(newReview);
  };

  public query ({ caller }) func getReviews() : async [Review] {
    reviews.toArray().sort(Review.compareTimestampDescending);
  };
};
