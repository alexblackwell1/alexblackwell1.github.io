import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import "./../css/cover.css";

interface Item {
  id: string;
  name: string;
}

const WishlistDetails = () => {
  const { user, signin } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState<any>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const { id } = useParams();
  const wishlistRef = id ? doc(db, "WishLists", id) : null;

  useEffect(() => {
    if (!id || !wishlistRef) return;

    const fetchWishlist = async () => {
      const docSnap = await getDoc(wishlistRef);
      if (docSnap.exists()) {
        setWishlist(docSnap.data());
        setItems(docSnap.data().items || []);
      }
    };
    fetchWishlist();
  }, [id, wishlistRef]);

  const handleAddItem = async () => {
    if (newItemName && wishlistRef) {
      await updateDoc(wishlistRef, {
        items: [...items, { id: Math.random().toString(), name: newItemName }],
      });
      setNewItemName("");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (wishlistRef) {
      const newItems = items.filter((item) => item.id !== itemId);
      await updateDoc(wishlistRef, {
        items: newItems,
      });
      setItems(newItems);
    }
  };

  if (!id) {
    return <div>Invalid wishlist ID</div>;
  }

  if (!wishlistRef) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="d-flex h-100 text-center text-white bg-dark">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <Header
            title={wishlist?.name ?? "Wishlist Items"}
            currentPage="/wishlists"
            links={[{ to: "/wishlists", label: "Wishlists" }]}
          />
          <main className="px-3">
            <p>Please sign in to view this list.</p>
            <button onClick={signin}>Sign In</button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex h-100 text-center text-white bg-dark">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header
          title={wishlist?.name ?? "Wishlist Items"}
          currentPage="/wishlists"
          links={[{ to: "/wishlists", label: "Wishlists" }]}
        />

        <main className="px-3">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item"
          />
          <button onClick={handleAddItem}>Add</button>
        </main>
      </div>
    </div>
  );
};

export default WishlistDetails;
