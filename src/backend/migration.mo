import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type OldMenuItem = {
    name : Text;
    description : Text;
    price : Nat;
  };

  type OldActor = {
    restaurantName : Text;
    upiId : Text;
    phoneNumber : Text;
    menuItems : Map.Map<Text, OldMenuItem>;
  };

  type NewMenuItem = {
    name : Text;
    description : Text;
    price : Nat;
  };

  type Review = {
    productName : Text;
    customerName : Text;
    starsCount : Nat;
    message : Text;
    timestamp : Int;
  };

  type NewActor = {
    restaurantName : Text;
    upiId : Text;
    phoneNumber : Text;
    menuItems : Map.Map<Text, NewMenuItem>;
    reviews : List.List<Review>;
  };

  public func run(old : OldActor) : NewActor {
    {
      restaurantName = old.restaurantName;
      upiId = old.upiId;
      phoneNumber = old.phoneNumber;
      menuItems = old.menuItems;
      reviews = List.empty<Review>();
    };
  };
};
